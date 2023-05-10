import { TiroRds } from "core/rds"

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
      .executeTakeFirst()

    // if email already exists 
      // if email is not verified, send verification email
      // if email is verified, let them know it's already registered

    // otherwise send verification email

    return {
      statusCode: 200,
      body: { success: true },
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