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
import { generateEmailSenderFromCategory } from "helpers/email"

const s3 = new S3Client({ region: "eu-west-1" })
const ses = new SESClient({ region: "eu-west-1" })

/**
 * This function runs when markdown file for the email contents is 
 * uploaded to S3 bucket. It formats the .md file into SES email 
 * template, stores them, then send it to test receivers.
 */
export async function handler(objectCreatedEvent: any) {

  const testEmailReceiver = "myzkmik19922@gmail.com"
  const category = process.env.BUCKET_CATEGORY

  console.log(`INFO(${category}): Object is uploaded to Markdown S3 bucket.`)

  if (!category) {
    const message = "process.env.BUCKET_CATEGORY is undefined."
    console.error(message)
    throw new Error(message)
  }

  try {
    const targetKey = objectCreatedEvent.Records[0].s3.object.key
  
    const getInput = {
      Bucket: process.env.MD_BUCKET_NAME,
      Key: targetKey,
    }

    const command = new GetObjectCommand(getInput)
    const response = await s3.send(command)
    const stream = response.Body as Readable

    const contentLine = readline.createInterface({
      input: stream,
      terminal: false
    })

    const date = targetKey.replace(".md", "")
    const contentsObj = await convertMdLinesToObject(date, category, contentLine)
    console.log(`INFO(${category}): Uploaded Markdown file has been converted to js object.`)

    const emailData = await convertObjectToEmail(contentsObj)
    console.log(`INFO(${category}): JS object has been converted to emailData.`)

    // template cannot override, so delete it first if
    // there's one with the same name
    const deleteCommand = new DeleteTemplateCommand({
      "TemplateName": `daily-${category}-template-${emailData.date}`
    })
    await ses.send(deleteCommand)

    const templateCommand = new CreateTemplateCommand({
      "Template": {
        "TemplateName": `daily-${category}-template-${emailData.date}`,
        "SubjectPart": emailData.subject,
        "TextPart": "Dear ,\r\nYour favorite animal is .",
        "HtmlPart": emailData.html
      }
    })

    await ses.send(templateCommand)
    console.log(`INFO(${category}): emailData have been converted to SES email template.`)

    const unsubscribeEndpoint 
      = await generateCustomUnsubscribeEndpoint(testEmailReceiver, category)

    const sender = generateEmailSenderFromCategory(category)

    const emailCommand = new SendTemplatedEmailCommand({
      "Source": sender,
      "Template": `daily-${category}-template-${emailData.date}`,
      "Destination": {
        "ToAddresses": [testEmailReceiver]
      },
      "TemplateData": 
        `{ \"dynamicUnsubscribeEndpoint\":\"${unsubscribeEndpoint}\" }`
    })
  
    await ses.send(emailCommand)
    console.log(`INFO(${category}): test email has been sent to ${testEmailReceiver}. `)
    
  } catch (error) {
    console.error(error)
  }
}
