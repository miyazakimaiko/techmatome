import { Subscriber } from "@/interfaces/subscriber"

export default function addSubscriber (subscriber: Subscriber): Subscriber {
  console.log("subscribed: ", subscriber)
  subscriber.tech = true;
  subscriber.verified = false;
  
  return subscriber
}