import { TiroRds } from "core/rds"

export async function handler(event: any) {
  try {
    const { email } = event.pathParameters
    const body = JSON.parse(event.body)

    await TiroRds.db
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
