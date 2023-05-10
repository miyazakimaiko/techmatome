import { Subscriber } from "@/interfaces/subscriber"
import Error from "next/error";

export default async function addSubscriber (subscriber: Subscriber): Promise<void> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  
    const body = {
      email_address: subscriber.email_address,
      tech_subscribed: 1,
      web_subscribed: subscriber.web_subscribed,
      ai_subscribed: subscriber.ai_subscribed,
    }
    
    await fetch(`${apiEndpoint}/create`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    
  } catch (error: any) {
    throw new Error(error)
  }
}