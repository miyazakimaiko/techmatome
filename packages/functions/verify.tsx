import { TiroRds } from "core/rds"

export async function handler(event: any) {
  try {
    const { email } = event.pathParameters

    await TiroRds.db
      .updateTable("subscriber")
      .set({ verified: 1 })
      .where("email_address", "=", email)
      .executeTakeFirst();

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
