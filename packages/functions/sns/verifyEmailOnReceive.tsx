import { TiroRds } from "core/rds"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { Topic } from "sst/node/topic"
import getWelcomeTemplates from "templates/welcome"
import libmime from "libmime"

const sns = new SNSClient({ region: "eu-west-1" })
const ses = new SESClient({ region: "eu-west-1" })

declare module "sst/node/topic" {
  export interface TopicResources {
    "SubscriberVerifiedTopic": {
      topicArn: string
    }
  }
}

export async function handler(event: any) {
  try {

    const message = JSON.parse(event.Records[0].Sns.Message)
    const filtered = message.mail.headers.filter((obj: any) => (
      obj.name === "Subject" || obj.name === "From"
    ))

    console.log({filtered})

    const res = await getSenderAndSubject(filtered)

    console.log({res})

    console.log('res.subject.includes("登録"): ', res.subject.includes("登録"))
    console.log('res.subject.includes("完了してください"): ', res.subject.includes("完了してください"))

    if (res.subject.includes("登録") && res.subject.includes("完了してください")) {
      verify(res.sender)
    }

  } catch (e: any) {
    console.error(e)
  }
}

async function getSenderAndSubject(filtered: any) {
  const res = {
    subject: "",
    sender: "",
  }
  for await (const item of filtered) {
    if (item.name === "Subject") {
      res.subject = item.value
    }
    else if (item.name === "From") {
      const regExpForEmail = /\<([^)]+)\>/g
      const email = regExpForEmail.exec(item.value)
      res.sender = email ? email[1] : item.value
    }
  }
  return res
}

async function verify(email: string) {
  try {    
    console.log("STARTED VERIFY FUNCTION: ", email)
    console.log({TiroRds})
  
    // const updateResult = await TiroRds.db
    // .updateTable("subscriber")
    // .set({ verified: 1 })
    // .where("email_address", "=", email)
    // .execute();
  
    console.log("DEBUGGING: targetEmail: ", email)
  
    // Publish SNS to be picked up by lambda emailing verified message
    console.log("========= publishing topic command to send verified email =======")
    await sendVerifiedNotification(email)
    console.log("email verified: ", email)

  } catch (error) {
    console.error("error: ", error)
    throw error
  }
}

export async function sendVerifiedNotification(email: string) {
  
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