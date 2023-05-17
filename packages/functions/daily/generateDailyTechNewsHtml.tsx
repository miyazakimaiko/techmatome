import * as readline from "readline"
import { Readable } from "stream"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import convertMdLinesToObject from "generators/convertMdLinesToObj"
import convertObjectToEmail from "generators/convertObjectToEmail"
import { encrypt } from "helpers/crypto"

const s3 = new S3Client({ region: "ap-northeast-1" })
const ses = new SESClient({ region: "ap-northeast-1" })

async function generateCustomUnsubscribeEndpoint(email: string) {
  const category = "tech"
  const e = await encrypt(email)
  const c = await encrypt(category)
  return `/unsubscribe?e=${e}&c=${c}&category=${category}`
}


export async function handler(objectCreatedEvent: any) {
  try {
    if (objectCreatedEvent.Records.length > 1) {
      throw new Error("Multiple object uploaded. Please upload one per day.")
    }

    const createdObjectKey = objectCreatedEvent.Records[0].s3.object.key
  
    const input = {
      Bucket: process.env.techNewsMarkdownBucketName,
      Key: createdObjectKey,
    }

    const command = new GetObjectCommand(input)
    const response = await s3.send(command)
    const stream = response.Body as Readable

    const contentLine = readline.createInterface({
      input: stream,
      terminal: false
    })

    const contentsObj = await convertMdLinesToObject(contentLine)
    const { subject, html } = await convertObjectToEmail(contentsObj)

    const emailCommand = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: ["myzkmik19922@gmail.com"]
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html.replace(
              "[customUnsubscribeEndpoint]", 
              await generateCustomUnsubscribeEndpoint("myzkmik19922@gmail.com")
            )
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject
        }
      },
      Source: "tiro.news.2023@gmail.com"
    })

    await ses.send(emailCommand)
    
  } catch (error) {
    console.error(error)
  }
}
