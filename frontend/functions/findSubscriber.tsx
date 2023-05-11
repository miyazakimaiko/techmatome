import Error from "next/error"
import { FindSubscriberPayload } from "@/interfaces/findSubscriberPayload"

export default async function findSubscriber (email: string): Promise<FindSubscriberPayload> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
    
    const response = await fetch(
      `${apiEndpoint}/find?email=${(email)}`, 
      {  method: "GET" }
    ) 
    return await response.json() as FindSubscriberPayload

  } catch (error: any) {
    throw new Error(error)
  }
}