import { DeleteTemplateCommand, SESClient, SendTemplatedEmailCommand } 
  from "@aws-sdk/client-ses"
import { TiroRds } from "core/rds"
import generateCustomUnsubscribeEndpoint 
  from "generators/generateCustomUnsubscribeEndpoint"
import { generateEmailSenderFromCategory } from "helpers/email"

const ses = new SESClient({ region: "eu-west-1" })

async function getSubscribersByCategory(category: string) {
  let subscribers

  if (category === "tech") {
    subscribers = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("verified", "=", 1)
      .where("tech_subscribed", "=", 1)
      .execute()
  }
  else if (category === "web") {
    subscribers = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("verified", "=", 1)
      .where("web_subscribed", "=", 1)
      .execute()
  }
  else if (category === "ai") {
    subscribers = await TiroRds.db
      .selectFrom("subscriber")
      .selectAll()
      .where("verified", "=", 1)
      .where("ai_subscribed", "=", 1)
      .execute()
  }
  
  return subscribers
}

/**
 * This function runs one a day by CronStack to send daily news to
 * subscribers using stored SES email template for the day.
 * Currently it does not delete template after use.
 */
export async function handler(_: any) {
  const category = process.env.CATEGORY
  
  console.log(`INFO(${category}): Daily news bulk-send cron job has started.`)

  if (!category) {
    console.log(`ERR(${category}): Category is not specified.`)
    return
  }

  try {

    const subscribers = await getSubscribersByCategory(category)

    if (!subscribers) {
      console.log(`ERR(${category}): No subscribers found.`)
      return
    }
  
    let sentCount = 0
  
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().replace(/T.*/,'')

    const sender = generateEmailSenderFromCategory(category)
  
    for(const subscriber of subscribers) {
      const unsubscribeEndpoint 
        = await generateCustomUnsubscribeEndpoint(subscriber.email_address, "tech")
  


      const emailCommand = new SendTemplatedEmailCommand({
        "Source": sender,
        "Template": `daily-${category}-template-${tomorrowStr}`,
        "Destination": {
          "ToAddresses": [subscriber.email_address]
        },
        "TemplateData": 
          `{ \"dynamicUnsubscribeEndpoint\":\"${unsubscribeEndpoint}\" }`
      })
    
      await ses.send(emailCommand)
      sentCount++
    }
    
    console.log(`INFO(${category}): Sent to total ${sentCount} 
      out of ${subscribers.length} subscribers.`)

    const deleteCommand = new DeleteTemplateCommand({
      "TemplateName": `daily-${category}-template-${tomorrowStr}`
    })
    await ses.send(deleteCommand)

    console.log(`INFO(${category}): email template for ${tomorrowStr} has been deleted.`)
    
  } catch (error: any) {
    throw new Error(error)
  }
}
