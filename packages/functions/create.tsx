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
      .execute()

    // otherwise send verification email

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
    
  } catch (e: any) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}
