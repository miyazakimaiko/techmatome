import Ajv from "ajv"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"
import { BadRequestError } from "../../core/errors"

const xata = new XataClient({ 
  apiKey: process.env.DB_API_KEY,
  branch: process.env.DB_BRANCH,
})

const sns = new SNSClient({
  region: "eu-west-1",
}) 

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

  function successResponse() {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        type: "created" 
      }),
    }
  }

  function errorResponse(e: any) {
    return {
      statusCode: e.status || 500,
      type: e.name || "InternalServerError",
      message: e.message || "Internal server error",
    }
  }

  return {
    validateEventBody,
    createSubscriber,
    sendSubscriberCreationTopic,
    successResponse,
    errorResponse,
  }
}

export const service = SubscriberCreationService(xata, sns)

export async function handler(event: any) {
  try {
    const eventBody = await service
      .validateEventBody(event)

    const creationRes = await service
      .createSubscriber(eventBody)
    
    await service
      .sendSubscriberCreationTopic(creationRes.email_address)
  
    return service.successResponse()
    
  } catch (e: any) {
    return service.errorResponse(e)
  }
}

declare module "sst/node/topic" {
  export interface TopicResources {
    "SubscriberCreationTopic": {
      topicArn: string
      topicSecretArn: string
    }
  }
}