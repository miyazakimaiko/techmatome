import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { TiroRds } from "core/rds"

const sns = new SNSClient({ region: "eu-west-2" })

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
    const body = JSON.parse(event.body)

    await TiroRds.db
      .insertInto("subscriber")
      .values({
        email_address: body.email_address,
        tech_subscribed: body.tech_subscribed,
        web_subscribed: body.web_subscribed,
        ai_subscribed: body.ai_subscribed,
      })
      .execute()

    // Publish SNS to be picked up by lambda emailing verification link
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({
        email: body.email_address,
        tech: body.tech_subscribed,
        web: body.web_subscribed,
        ai: body.ai_subscribed,
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
