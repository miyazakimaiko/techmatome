import { TiroRds } from "core/rds"

export async function handler(event: any) {
  try {
    const { email } = event.queryStringParameters

    const subscribed = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("email_address", "=", email)
      .executeTakeFirst()

    return {
      statusCode: 200,
      body: subscribed ?? "Not found",
    }
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}