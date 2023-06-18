import Ajv from "ajv"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"
import { BadRequestError } from "./common/errors"
import { errorResponse, creationSuccessResponse } from "./common/responses"

const xata = new XataClient({ 
  apiKey: process.env.DB_API_KEY,
  branch: process.env.DB_BRANCH,
})

const sns = new SNSClient({
  region: "eu-west-1",
}) 

declare module "sst/node/topic" {
  export interface TopicResources {
    "SubscriberCreationTopic": {
      topicArn: string
      topicSecretArn: string
    }
  }
}

export function SubscriberCreationService(dbClient: any, snsClient: any) {

  async function validateEventBody(event: any) {
    const schema = {
      type: "object",
      properties: {
        email_address: {type: "string"},
        tech_subscribed: {type: "integer"},
        web_subscribed: {type: "integer"},
        crypto_subscribed: {type: "integer"}
      },
      required: ["email_address"],
      additionalProperties: false,
    }
    const eventBody = JSON.parse(event.body)
    const schemaValidator = new Ajv().compile(schema)
    const validBodyIsValid = schemaValidator(eventBody)

    if (!validBodyIsValid) {
      throw new BadRequestError("Invalid body")
    }
    return eventBody
  }

  async function createSubscriber(eventBody: object) {
    const res = await dbClient.db.subscriber.create(eventBody)

    if (!res.email_address) {
      throw new Error("Could not get email_address from response")
    }
    return res
  }

  async function sendSubscriberCreationTopic(email: string) {
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({ email }),
    })
    return await snsClient.send(command)
  }

  async function main(event: any) {
    try {
      const eventBody = await validateEventBody(event)
      const creationRes = await createSubscriber(eventBody)
      
      await sendSubscriberCreationTopic(creationRes.email_address)
    
      return creationSuccessResponse("created")
      
    } catch (e: any) {
      return errorResponse(e)
    }
  }

  return {
    validateEventBody,
    createSubscriber,
    sendSubscriberCreationTopic,
    main
  }
}

const service = SubscriberCreationService(xata, sns)

export async function handler(event: any) {
  await service.main(event)
}