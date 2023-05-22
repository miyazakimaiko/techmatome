import { TiroRds } from "core/rds"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Topic } from "sst/node/topic"
import { generateEncryptedToken } from "helpers/verificationToken"

const sns = new SNSClient({ region: "ap-northeast-1" })

declare module "sst/node/topic" {
  export interface TopicResources {
    "SubscriberVerifiedTopic": {
      topicArn: string
    }
  }
}

export async function handler(event: any) {
  try {
    const { email, token } = event.queryStringParameters

    const encryptedToken = await generateEncryptedToken(token)

    const tokenData = await TiroRds.db
      .selectFrom("email_verification_token")
      .selectAll()
      .where("email_address", "=", email)
      .where("encrypted_token", "=" ,encryptedToken)
      .executeTakeFirst()

    const created_at_str = tokenData!.created_at!.toString() + "+00:00"
    const created_at_epoch = Date.parse(created_at_str)
    const expired_at_epoch = created_at_epoch + 60000 // 60000/1 min for development; 600000/10 mins for prod
    const current_epoch = new Date().getTime()

    if (!tokenData || (expired_at_epoch < current_epoch)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false }),
      }
    }

    await TiroRds.db
      .updateTable("subscriber")
      .set({ verified: 1 })
      .where("email_address", "=", email)
      .execute();

    await TiroRds.db
      .deleteFrom("email_verification_token")
      .where("email_address", "=", email)
      .execute();

    // Publish SNS to be picked up by lambda emailing verified message
    const command = new PublishCommand({ 
      TopicArn: Topic.SubscriberVerifiedTopic.topicArn,
      Message: JSON.stringify({ email }),
    })

    await sns.send(command)

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
