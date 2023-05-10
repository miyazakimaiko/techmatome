import { TiroRds } from "core/rds"

export async function handler(event: any) {
  try {
    const { email } = event.pathParameters
    const body = JSON.parse(event.body)

    const updated = await TiroRds.db
      .updateTable("subscriber")
      .set({
        tech_subscribed: body.tech_subscribed,
        web_subscribed: body.web_subscribed,
        ai_subscribed: body.ai_subscribed,
      })
      .where("email_address", "=", email)
      .returningAll()
      .executeTakeFirst()

    return {
      statusCode: 200,
      body: updated ?? "No user is updated",
    }
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }

}

// {
//   "email_address": "test3@gmail.com",
//   "tech_subscribed": 1,
//   "web_subscribed": 1,
//   "ai_subscribed": 1
// }