import { StackContext, Topic, use } from "sst/constructs"
import { ConfigStack } from "./ConfigStack";

export function SnsStack({ stack }: StackContext) {

  const { params } = use(ConfigStack)

  // send on creation
  const subscriberCreationTopic = new Topic(stack, "SubscriberCreationTopic", {
    subscribers: {
      emailVerificationLink: "packages/functions/sns/emailVerificationLink.handler",
    },
  })
  subscriberCreationTopic.attachPermissionsToSubscriber(
    "emailVerificationLink",
    [
      "ses:SendEmail", 
      "ses:SendRawEmail",
    ]
  )
  subscriberCreationTopic.bind([params]);

  // send when verified
  const subscriberVerifiedTopic = new Topic(stack, "SubscriberVerifiedTopic", {
    subscribers: {
      emailVerifiedNotification: "packages/functions/sns/emailVerifiedNotification.handler",
    },
  })
  subscriberVerifiedTopic.attachPermissionsToSubscriber(
    "emailVerifiedNotification",
    [
      "ses:SendEmail", 
      "ses:SendRawEmail", 
      "secretsmanager:GetSecretValue",
    ]
  )
  subscriberVerifiedTopic.bind([params]);

  // output
  stack.addOutputs({
    SubscriberCreationTopicArn: subscriberCreationTopic.topicArn,
    subscriberVerifiedTopicArn: subscriberVerifiedTopic.topicArn,
  })

  return { 
    subscriberCreationTopic,
    subscriberVerifiedTopic,
  }
}