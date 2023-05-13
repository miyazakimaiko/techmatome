import { StackContext, Topic } from "sst/constructs"

export function SnsStack({ stack }: StackContext) {

  const subscriberCreationTopic = new Topic(stack, "SubscriberCreationTopic", {
    subscribers: {
      emailVerificationLink: "packages/functions/emailVerificationLink.handler",
    },
  })

  subscriberCreationTopic.attachPermissionsToSubscriber(
    "emailVerificationLink",
    ["ses:SendEmail", "ses:SendRawEmail"]
  )

  stack.addOutputs({
    SubscriberCreationTopicArn: subscriberCreationTopic.topicArn,
  })

  return { 
    subscriberCreationTopic,
  }
}