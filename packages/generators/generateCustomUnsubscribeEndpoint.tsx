import { encrypt } from "helpers/crypto"

export default async function generateCustomUnsubscribeEndpoint(email: string, category: string) {
  const e = await encrypt(email)
  const c = await encrypt(category)
  return `unsubscribe?e=${e}&c=${c}&category=${category}`
}