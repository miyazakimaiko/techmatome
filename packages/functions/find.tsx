import { TiroRds } from "core/rds"

export async function handler(event: any) {
  try {
    const { email } = event.queryStringParameters

    const subscriber = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("email_address", "=", email)
      .executeTakeFirst()

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        found: Boolean(subscriber),
        data: subscriber
      })
    }

  } catch (e: any) {
    console.error(e)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
}