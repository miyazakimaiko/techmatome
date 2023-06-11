import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })
const sns = new SNSClient({ region: "eu-west-1" })

export async function handler(event: any) {
  try {
    const { id } = event.queryStringParameters
    const body = JSON.parse(event.body)

    const res = await xata.db.subscriber.update(id, { 
      tech_subscribed: body.tech_subscribed,
      web_subscribed: body.web_subscribed,
      crypto_subscribed: body.crypto_subscribed,
    })

    if (res && !res.verified) {

      const command = new PublishCommand({ 
        TopicArn: Topic.SubscriberCreationTopic.topicArn,
        Message: JSON.stringify({
          email: res.email_address,
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
