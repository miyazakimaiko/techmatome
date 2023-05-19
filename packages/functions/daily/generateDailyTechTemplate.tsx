import * as readline from "readline"
import { Readable } from "stream"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { CreateTemplateCommand, DeleteTemplateCommand, 
        SESClient, SendTemplatedEmailCommand } 
  from "@aws-sdk/client-ses"
import convertMdLinesToObject from "generators/convertMdLinesToObj"
import convertObjectToEmail from "generators/convertObjectToEmail"
import generateCustomUnsubscribeEndpoint 
  from "generators/generateCustomUnsubscribeEndpoint"

const s3 = new S3Client({ region: "ap-northeast-1" })
const ses = new SESClient({ region: "ap-northeast-1" })

/**
 * This function runs when markdown file for the email contents is 
 * uploaded to S3 bucket. It formats the .md file into SES email 
 * template, stores them, then send it to test receivers.
 */
export async function handler(objectCreatedEvent: any) {

  const testEmailReceiver = "myzkmik19922@gmail.com"

  console.log("INFO: Object is uploaded to Markdown S3 bucket.")

  try {
    
    if (objectCreatedEvent.Records.length > 1) {
      throw new Error(
        "Multiple object uploaded. Please upload one per day.")
    }

    const targetKey = objectCreatedEvent.Records[0].s3.object.key
  
    const getInput = {
      Bucket: process.env.techNewsMdBucketName,
      Key: targetKey,
    }

    const command = new GetObjectCommand(getInput)
    const response = await s3.send(command)
    const stream = response.Body as Readable

    const contentLine = readline.createInterface({
      input: stream,
      terminal: false
    })

    const contentsObj = await convertMdLinesToObject(contentLine)
    console.log("INFO: Uploaded Markdown file has been converted to js object.")

    const emailData = await convertObjectToEmail(contentsObj)
    console.log("INFO: JS object has been converted to emailData.")

    // template cannot override, so delete it first if
    // there's one with the same name
    const deleteCommand = new DeleteTemplateCommand({
      "TemplateName": `daily-news-template-${emailData.date}`
    })
    await ses.send(deleteCommand)

    const templateCommand = new CreateTemplateCommand({
      "Template": {
        "TemplateName": `daily-news-template-${emailData.date}`,
        "SubjectPart": emailData.subject,
        "TextPart": "Dear ,\r\nYour favorite animal is .",
        "HtmlPart": emailData.html
      }
    })

    await ses.send(templateCommand)
    console.log("INFO: emailData have been converted to SES email template.")

    const unsubscribeEndpoint 
      = await generateCustomUnsubscribeEndpoint(testEmailReceiver, "tech")

    const emailCommand = new SendTemplatedEmailCommand({
      "Source": "tiro.news.2023@gmail.com",
      "Template": `daily-news-template-${emailData.date}`,
      "Destination": {
        "ToAddresses": [testEmailReceiver]
      },
      "TemplateData": 
        `{ \"dynamicUnsubscribeEndpoint\":\"${unsubscribeEndpoint}\" }`
    })
  
    await ses.send(emailCommand)
    console.log(`INFO: test email has been sent to ${testEmailReceiver}.`)
    
  } catch (error) {
    console.error(error)
  }
}
