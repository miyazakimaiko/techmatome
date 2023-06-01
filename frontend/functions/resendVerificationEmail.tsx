import Error, { ErrorProps } from "next/error"

export default async function resendVerificationEmail(email: string): Promise<any> {
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