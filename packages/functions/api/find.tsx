import { XataClient } from "../../xata"
import { BadRequestError, NotFoundError } from "./common/errors"
import { findSuccessResponse, errorResponse } from "./common/responses"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })

export function SubscriberFindService(dbClient: any) {

  async function validateEventQueryStringParam(event: any) {
    if (!event.queryStringParameters.email) {
      throw new BadRequestError("Email query string parameter is required")
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

  async function main(event: any) {
    try {
      const { email } = await validateEventQueryStringParam(event)
      const subscriber = await findSubscriber(email)
  
      return findSuccessResponse(subscriber)
  
    } catch (e: any) {
      return errorResponse(e)
    }
  }

  return {
    validateEventQueryStringParam,
    findSubscriber,
    main,
  }
}

const service = SubscriberFindService(xata)

export async function handler(event: any) {
  service.main(event)
}