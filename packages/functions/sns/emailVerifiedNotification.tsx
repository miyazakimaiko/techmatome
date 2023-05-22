import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SNSEvent } from "aws-lambda"
import getWelcomeTemplates from "templates/welcome"

const ses = new SESClient({ region: "ap-northeast-1" })

export async function handler(event: SNSEvent) {
  
  const { email } = JSON.parse(event.Records[0].Sns.Message)
  const { html, text } = await getWelcomeTemplates(email)

  const emailCommand = new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html
        },
        Text: {
          Charset: "UTF-8",
          Data: text
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "【登録完了】TiROニュースまとめ"
      }
    },
    Source: "tiro.news.2023@gmail.com"
  })

  try {
    await ses.send(emailCommand)
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
