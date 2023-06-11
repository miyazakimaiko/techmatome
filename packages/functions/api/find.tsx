import { XataClient } from "../../xata"

const xata = new XataClient({ apiKey: process.env.DB_API_KEY })

export async function handler(event: any) {
  try {
    const { email } = event.queryStringParameters

    const subscribers = await xata.db.subscriber
      .filter({ email_address: email })
      .getMany()

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        found: Boolean(subscribers[0]),
        data: subscribers[0]
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