import { TiroRds } from "core/rds"
import { decrypt } from "helpers/crypto"
import { UpdateObject } from "kysely"
import { Database } from "core/interfaces"


/**
 * 
 * @description Update the category subscribed to 0.
 * After update, check if all of subscriptions are 0.
 * If that's the case, delete the subscriber from DB.
 */
export async function handler(event: any) {
  try {
    const { e, c } = event.queryStringParameters

    const category = await decrypt(c)
    const email = await decrypt(e)

    const subscriber = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("email_address", "=", email)
      .executeTakeFirst()

    if (!subscriber) {
      throw new Error("Subscriber does not exist")
    }

    const updateValues = {} as UpdateObject<Database, "subscriber", "subscriber">

    if (category === "all") {
      await TiroRds.db
        .deleteFrom("subscriber")
        .where("email_address", "=", email)
        .execute()

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
    else if (category === "ai") {
      if (subscriber.ai_subscribed === 1) {
        updateValues.ai_subscribed = 0
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

    const [res] = await TiroRds.db
      .updateTable("subscriber")
      .set(updateValues)
      .where("email_address", "=", email)
      .returningAll()
      .execute()

    console.log(res)

    if ((res.tech_subscribed
        + res.web_subscribed
        + res.ai_subscribed) === 0) {
          await TiroRds.db
            .deleteFrom("subscriber")
            .where("email_address", "=", email)
            .execute()
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
