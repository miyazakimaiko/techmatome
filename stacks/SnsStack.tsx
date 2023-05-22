import { StackContext, Topic } from "sst/constructs"

export function SnsStack({ stack }: StackContext) {

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
      "ssm:GetParameter",
    ]
  )

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
      "ssm:GetParameter",
    ]
  )

  stack.addOutputs({
    SubscriberCreationTopicArn: subscriberCreationTopic.topicArn,
    subscriberVerifiedTopicArn: subscriberVerifiedTopic.topicArn,
  })

  return { 
    subscriberCreationTopic,
    subscriberVerifiedTopic,
  }
}