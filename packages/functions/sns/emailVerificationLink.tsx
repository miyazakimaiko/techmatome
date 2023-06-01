import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SNSEvent } from "aws-lambda"
import libmime from "libmime"
import getVerificationTemplates from "templates/verification"

const client = new SESClient({ region: "eu-west-1" })

export async function handler(event: SNSEvent) {
  
  const { email } = JSON.parse(event.Records[0].Sns.Message)
  const { html, text } = await getVerificationTemplates(email)
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
        Data: "【登録を完了してください】Techまとめニュースレター"
      }
    },
    Source: `${libmime.encodeWord(senderName)} <miyazaki@techmatome.com>`
  })

  try {
    await client.send(emailCommand)
    console.log("INFO: Verification email has been sent to a new subscriber.")

  } catch (error) {
    console.error(error)
  }
}
