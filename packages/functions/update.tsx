import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { TiroRds } from "core/rds"
import { insertEmailVerificationToken } from "helpers/verificationToken"

const sns = new SNSClient({ region: "ap-northeast-1" })

export async function handler(event: any) {
  try {
    const { email } = event.pathParameters
    const body = JSON.parse(event.body)

    const res = await TiroRds.db
      .updateTable("subscriber")
      .set({
        tech_subscribed: body.tech_subscribed,
        web_subscribed: body.web_subscribed,
        ai_subscribed: body.ai_subscribed,
      })
      .where("email_address", "=", email)
      .returningAll()
      .executeTakeFirst()

      if (!res?.verified) {
        const token = await insertEmailVerificationToken(
          TiroRds.db, body.email_address)

        const command = new PublishCommand({ 
          TopicArn: Topic.SubscriberCreationTopic.topicArn,
          Message: JSON.stringify({
            email: body.email_address,
            token
          }),
        })
        await sns.send(command)
      }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        type: "updated",
        verified: res?.verified
      }),
    }
  } catch (e: any) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}
