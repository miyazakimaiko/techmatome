import { SESClient, SendTemplatedEmailCommand } 
  from "@aws-sdk/client-ses"
import { TiroRds } from "core/rds"
import generateCustomUnsubscribeEndpoint 
  from "generators/generateCustomUnsubscribeEndpoint"

const ses = new SESClient({ region: "ap-northeast-1" })

/**
 * This function runs one a day by CronStack to send daily news to
 * subscribers using stored SES email template for the day.
 * Currently it does not delete template after use.
 */
export async function handler(_: any) {

  console.log("INFO: Daily news bulk-send cron job has started.")

  try {
    const subscribers = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("verified", "=", 1)
      .where("tech_subscribed", "=", 1)
      .execute()
  
    let sentCount = 0
  
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().replace(/T.*/,'')
  
    for(const subscriber of subscribers) {
      const unsubscribeEndpoint 
        = await generateCustomUnsubscribeEndpoint(subscriber.email_address, "tech")
  
      const emailCommand = new SendTemplatedEmailCommand({
        "Source": "tiro.news.2023@gmail.com",
        "Template": `daily-news-template-${tomorrowStr}`,
        "Destination": {
          "ToAddresses": [subscriber.email_address]
        },
        "TemplateData": 
          `{ \"dynamicUnsubscribeEndpoint\":\"${unsubscribeEndpoint}\" }`
      })
    
      await ses.send(emailCommand)
      sentCount++

      console.log(
        `INFO: Sent to total ${sentCount} out of ${subscribers.length} subscribers.`)
    }
    
  } catch (error: any) {
    throw new Error(error)
  }
}
