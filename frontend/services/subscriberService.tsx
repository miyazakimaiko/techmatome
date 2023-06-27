import { FindSubscriberPayload } from "@/interfaces/findSubscriberPayload"
import { Subscriber } from "@/interfaces/subscriber"
import Error, { ErrorProps } from "next/error"

async function find(email: string): Promise<FindSubscriberPayload> {
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

function addUpdate(isSubscribed: boolean, subscriber: Subscriber): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const requestEndpoint = process.env.NEXT_PUBLIC_MAIN_API
    let payload
  
    const body = {
      email_address: subscriber.email_address,
      tech_subscribed: subscriber.tech_subscribed,
      web_subscribed: subscriber.web_subscribed,
      crypto_subscribed: subscriber.crypto_subscribed,
    }
    
    if (isSubscribed) {
      payload = await fetch(`${requestEndpoint}/update?id=${subscriber.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      })
    } else {
      payload = await fetch(`${requestEndpoint}/create`, {
        method: "POST",
        body: JSON.stringify(body),
      })
    }

    if (payload) {
      resolve(payload.json())
    }
    reject()
  })
}

async function resendVerificationEmail(email: string): Promise<any> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_MAIN_API
    
    const response = await fetch(
      `${apiEndpoint}/resend-verification?email=${email}`, 
      {  method: "POST" }
    )

    const resJson = await response.json()

    if (resJson.success !== true) {
      throw new Error({statusCode: 500} as ErrorProps)
    }

    return resJson

  } catch (error: any) {
    throw error
  }
}

async function verify(email: string, token: string): Promise<any> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_MAIN_API
    
    const response = await fetch(
      `${apiEndpoint}/verify?email=${email}&token=${token}`, 
      {  method: "POST" }
    ) 
    return await response.json()

  } catch (error: any) {
    throw new Error(error)
  }
}

async function unsubscribe(encrypted: string, category: string): Promise<any> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_MAIN_API
    
    const response = await fetch(
      `${apiEndpoint}/unsubscribe?e=${encrypted}&c=${category}`, 
      {  method: "POST" }
    ) 
    return await response.json()

  } catch (error: any) {
    throw new Error(error)
  }
}

export default {
  find,
  addUpdate,
  resendVerificationEmail,
  verify,
  unsubscribe,
}