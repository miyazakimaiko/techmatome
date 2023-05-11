import { Subscriber } from "@/interfaces/subscriber"
import Error from "next/error";

export default async function addUpdateSubscriber(isSubscribed: boolean, subscriber: Subscriber): Promise<any> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
    let payload;
  
    const body = {
      email_address: subscriber.email_address,
      tech_subscribed: subscriber.tech_subscribed,
      web_subscribed: subscriber.web_subscribed,
      ai_subscribed: subscriber.ai_subscribed,
    }
    
    if (isSubscribed) {
      payload = await fetch(`${apiEndpoint}/update/${subscriber.email_address}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    } else {
      payload = await fetch(`${apiEndpoint}/create`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    }
    return payload.json()
    
  } catch (error: any) {
    throw new Error(error)
  }
}