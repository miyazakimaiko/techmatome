import libmime from "libmime"
import { Config } from 'sst/node/config'
import { SESClient, SendEmailCommand, SendEmailCommandOutput } 
  from "@aws-sdk/client-ses"
import getWelcomeTemplates from "templates/welcome"
import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: Config.DB_API_KEY })

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
    const mailHeaders = 
      JSON.parse(event.Records[0].Sns.Message).mail.headers

    const filteredSnsMessage = mailHeaders.filter((obj: any) => (
      obj.name === "Subject" || obj.name === "From"
    ))

    const { sender, subject } = 
      await extractSenderAndSubject(filteredSnsMessage)

    const emailIsReplyToVerificationEmail = 
      subject.includes("登録") && subject.includes("完了してください")

    if (emailIsReplyToVerificationEmail) {
      await verify(sender)

    } else {
      console.log("Email is not a reply to verification email. Ignoring")
    }

  } catch (e: any) {
    console.error(e)
  }
}

async function extractSenderAndSubject(filtered: any) {
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
    const res = await updateSubscriberTableByEmail(email)

    if (res && res.email_address) {
      await sendWelcomeEmail(res.email_address)
      console.log(
        "Email has been verified and sent welcome email to: ", res.email_address)
    } else {
      console.log("Email is already verified. Ignoring")
    }

  } catch (error) {
    console.error("error: ", error)
    throw error
  }
}

async function updateSubscriberTableByEmail(email: string) {
  const subscribers = await xata.db.subscriber
  .filter({ email_address: email })
  .getMany();

  const target = subscribers[0]

  if (target) {
    return await xata.db.subscriber.update(target.id, { 
      verified: 1,
    })
  }
  else throw new Error("No subscriber found")
}

export async function sendWelcomeEmail(email: string): Promise<SendEmailCommandOutput> {
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

  return await ses.send(emailCommand)
}