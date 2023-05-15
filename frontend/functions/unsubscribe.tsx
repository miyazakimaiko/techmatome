import Error from "next/error"

export default async function unsubscribe(encrypted: string, category: string): Promise<any> {
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