import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SNSEvent } from "aws-lambda"
import libmime from "libmime"
import getWelcomeTemplates from "templates/welcome"

const ses = new SESClient({ region: "eu-west-1" })

export async function handler(event: SNSEvent) {
  
  const { email } = JSON.parse(event.Records[0].Sns.Message)
  const { html, text } = await getWelcomeTemplates(email)
  const senderName = "Techまとめ"

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
        Data: "【登録完了しました！】Techまとめニュースレター"
      }
    },
    Source: `${libmime.encodeWord(senderName)} <miyazaki@techmatome.com>`
  })

  try {
    await ses.send(emailCommand)
    console.log("INFO: Email has been verified and sent welcome email.")

  } catch (error) {
    console.error(error)
  }
}
