import { decrypt } from "helpers/crypto"
import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })

async function deleteSubscriberById(id: string) {
  return await xata.db.subscriber.delete(id)
}
/**
 * This unsubscribe function updates the subscribed category of 
 * the user to 0. After update, check if all of their subscriptions are 0.
 * If that's the case, delete the subscriber from DB.
 */
export async function handler(event: any) {

  try {
    const { e, c } = event.queryStringParameters

    const category = await decrypt(c)
    const email = await decrypt(e)

    const subscribers = await xata.db.subscriber
      .filter({ email_address: email })
      .getMany()

    const subscriber = subscribers[0]

    if (!subscriber) {
      throw new Error("Subscriber does not exist")
    }

    const updateValues = {
      tech_subscribed: 0,
      web_subscribed: 0,
      crypto_subscribed: 0,
    }

    if (category === "all") {
      await deleteSubscriberById(subscriber.id)

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          type: "unsubscribed",
          category
        }),
      }
    }
    else if (category === "tech") {
      if (subscriber.tech_subscribed === 1) {
        updateValues.tech_subscribed = 0
      }
      else {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true,
            type: "unsubscribed",
            category
          }),
        }
      }
    } 
    else if (category === "web") {
      if (subscriber.web_subscribed === 1) {
        updateValues.web_subscribed = 0
      }
      else {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true,
            type: "unsubscribed",
            category
          }),
        }
      }    
    }
    else if (category === "crypto") {
      if (subscriber.crypto_subscribed === 1) {
        updateValues.crypto_subscribed = 0
      }
      else {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true,
            type: "unsubscribed",
            category
          }),
        }
      }    
    }

    const res = await xata.db.subscriber.update(subscriber.id, { 
      ...updateValues
    })

    if (res && 
      (res.tech_subscribed
      + res.web_subscribed
      + res.crypto_subscribed) === 0
    ) {
      deleteSubscriberById(subscriber.id)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        type: "unsubscribed",
        category
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
