import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { XataClient } from "../../xata"
import { BadRequestError, NotFoundError } from "./common/errors"
import { errorResponse, successResponse } from "./common/responses"

const xata = new XataClient({ 
  apiKey: process.env.DB_API_KEY,
  branch: process.env.DB_BRANCH,
})
const sns = new SNSClient({
  region: "eu-west-1"
})

export function ResendVerificationService(dbClient: any, snsClient: any) {

  async function validateEventQueryStringParam(event: any) {
    if (!event.queryStringParameters) {
      throw new BadRequestError("Missing queryStringParameters")
    }
    if (!event.queryStringParameters.email) {
      throw new BadRequestError("Missing email queryStringParameter")
    }
    return event.queryStringParameters
  }

  async function findSubscriber(email: string) {
    const subscribers = await dbClient.db.subscriber
      .filter({ email_address: email })
      .getMany()

    if (!subscribers[0]) {
      throw new NotFoundError("Could not find subscriber")
    }
    return subscribers[0]
  }

  async function sendSubscriberCreationTopic(email: string) {
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberCreationTopic.topicArn,
      Message: JSON.stringify({
        email,
      }),
    })

    await snsClient.send(command)
    return true
  }

  async function main(event: any) {
    try {
      const { email } = await validateEventQueryStringParam(event)
      const subscriber = await findSubscriber(email)
      await sendSubscriberCreationTopic(subscriber.email_address)

      return successResponse("resent")

    } catch (e: any) {
      return errorResponse(e)
    }
  }

  return {
    validateEventQueryStringParam,
    findSubscriber,
    sendSubscriberCreationTopic,
    main,
  }
}

const service = ResendVerificationService(xata, sns)

export async function handler(event: any) {
  service.main(event)
}