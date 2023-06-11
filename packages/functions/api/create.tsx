import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })
const sns = new SNSClient({ region: "eu-west-1" })

declare module "sst/node/topic" {
  export interface TopicResources {
    "SubscriberCreationTopic": {
      topicArn: string
      topicSecretArn: string
    }
  }
}

export async function handler(event: any) {
  try {
    const res = await xata.db.subscriber.create(
      JSON.parse(event.body)
    )

    // Publish SNS to be picked up by lambda sending verification email
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({
        email: res.email_address,
      }),
    })

    await sns.send(command)

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        type: "created" 
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
