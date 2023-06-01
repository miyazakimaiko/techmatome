import { FindSubscriberPayload } from "@/interfaces/findSubscriberPayload"

export default async function findSubscriber (email: string): Promise<FindSubscriberPayload> {
  let retryCount = 0
  let error
  let res = {} as FindSubscriberPayload
  while (retryCount < 5 && !Object.keys(res).includes("found")) {
    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_MAIN_API
      
      const response = await fetch(
        `${apiEndpoint}/find?email=${(email)}`, 
        {  method: "GET" }
      ) 
      res = await response.json() as FindSubscriberPayload
      retryCount++
  
    } catch (err: any) {
      error = err
      console.error(err)
      retryCount++
    }
  }
  if (!Object.keys(res).includes("found")) {
    throw new Error(error)
  }
  return res
}