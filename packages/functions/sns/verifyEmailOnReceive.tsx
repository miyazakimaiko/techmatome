import { TiroRds } from "core/rds"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"

const sns = new SNSClient({ region: "eu-west-1" })

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

    const res = {
      subject: "",
      sender: "",
    }
    for (const item of filtered) {
      if (item.name === "Subject") {
        res.subject = item.value
      }
      else if (item.name === "From") {
        const regExpForEmail = /\<([^)]+)\>/g
        const email = regExpForEmail.exec(item.value)
        res.sender = email ? email[1] : item.value
      }
    }

    if (res.subject.includes("登録") && res.subject.includes("完了してください")) {
      verify(res.sender)
    }

  } catch (e: any) {
    console.error(e)
  }
}

async function verify(email: string) {
  const updateResult = await TiroRds.db
  .updateTable("subscriber")
  .set({ verified: 1 })
  .where("email_address", "=", email)
  .returning("email_address")
  .execute();

  const targetEmail = updateResult[0].email_address

  if (targetEmail) {
    // Publish SNS to be picked up by lambda emailing verified message
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberVerifiedTopic.topicArn,
      Message: JSON.stringify({ email: targetEmail }),
    })
    await sns.send(command)
  }
  console.log("email verified: ", targetEmail)
}