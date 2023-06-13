import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"

const xata = new XataClient({ 
  apiKey: process.env.DB_API_KEY,
  branch: process.env.DB_BRANCH,
})
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
    const res = await createSubscriber(event.body)

    if (!res.email_address) {
      throw new Error("Could not get email_address from response")
    }
    
    await sendSubscriberCreationTopic(res.email_address);
  
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
      type: e.name,
      message: e.message,
    }
  }
}

async function createSubscriber(eventBodyString: string) {
  const eventBody = JSON.parse(eventBodyString)

  if (!eventBody.email_address) {
    throw new Error("Email address is undefined")
  }
  return await xata.db.subscriber.create(
    JSON.parse(eventBody)
  )
}

async function sendSubscriberCreationTopic(email: string) {
  const command = new PublishCommand({ 
    TopicArn: Topic.SubscriberCreationTopic.topicArn,
    Message: JSON.stringify({ email }),
  })
  await sns.send(command)
}