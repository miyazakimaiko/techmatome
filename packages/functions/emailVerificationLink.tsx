import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SNSEvent } from "aws-lambda"

const client = new SESClient({ region: "eu-west-2" })

export async function handler(event: SNSEvent) {
  const { email } = JSON.parse(event.Records[0].Sns.Message)

  const body  = {
    message: "Hello from SES",
    subject: "Welcome to TiRO!"
  }

  const emailCommand = new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: JSON.stringify(body)
        },
        Text: {
          Charset: "UTF-8",
          Data: JSON.stringify(body)
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: body.subject || "Support Request"
      }
    },
    Source: "tiro.news.2023@gmail.com"
  })

  try {
    await client.send(emailCommand)
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }

  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    }
  }
}
