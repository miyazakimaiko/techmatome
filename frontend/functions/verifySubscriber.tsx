import Error from "next/error"

export default async function verifySubscriber(email: string, token: string): Promise<any> {
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