import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { TiroRds } from "core/rds"
import { insertEmailVerificationToken } from "helpers/verificationToken"

const sns = new SNSClient({ region: "ap-northeast-1" })

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
      .values(body)
      .execute()

    const token = await insertEmailVerificationToken(TiroRds.db, body.email_address)

    // Publish SNS to be picked up by lambda emailing verification link
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({
        email: body.email_address,
        token
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
