import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { TiroRds } from "core/rds"

const sns = new SNSClient({ region: "eu-west-1" })

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

        const command = new PublishCommand({ 
          TopicArn: Topic.SubscriberCreationTopic.topicArn,
          Message: JSON.stringify({
            email: body.email_address,
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
