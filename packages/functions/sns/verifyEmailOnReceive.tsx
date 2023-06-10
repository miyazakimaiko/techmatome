import { TiroRds } from "core/rds"
import { SESClient, SendEmailCommand, SendEmailCommandOutput } from "@aws-sdk/client-ses"
import getWelcomeTemplates from "templates/welcome"
import libmime from "libmime"

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
    const updateResList = await updateSubscriberTableByEmail(email)
    const verifiedEmail = updateResList[0].email_address

    if (verifiedEmail) {
      const sendEmailOutput = await sendVerifiedNotificationToEmail(verifiedEmail)
      console.log("sendEmailOutput: ", sendEmailOutput);
      console.log("Email has been verified and sent welcome email to: ", verifiedEmail)
    } else {
      console.log("Email is already verified. Ignoring")
    }

  } catch (error) {
    console.error("error: ", error)
    throw error
  }
}

async function updateSubscriberTableByEmail(email: string) {
  return await TiroRds.db
    .updateTable("subscriber")
    .set({ verified: 1 })
    .where("email_address", "=", email)
    .returning('email_address')
    .execute();
}

export async function sendVerifiedNotificationToEmail(email: string): Promise<SendEmailCommandOutput> {
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