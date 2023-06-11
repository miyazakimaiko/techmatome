import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })
const sns = new SNSClient({ region: "eu-west-1" })

export async function handler(event: any) {
  try {
    const { email } = event.queryStringParameters

    const subscribers = await xata.db.subscriber
      .filter({ email_address: email })
      .getMany()

    if (!subscribers[0]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: "Cannot find subscriber"
        }),
      }
    }

    // Publish SNS to be picked up by lambda sending verification email
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({
        email: subscribers[0].email_address,
      }),
    })

    await sns.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        type: "resent" 
      })
    }

  } catch (e: any) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}