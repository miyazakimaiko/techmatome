import { Database } from "core/interfaces"
import { randomBytes, createCipheriv } from "crypto"
import { Kysely } from "kysely"
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

const client = new SecretsManagerClient({ region: "ap-northeast-1" })
const input = { 
  SecretId: "crypto/cipher",
}

export async function generateEncryptedToken(token: string): Promise<any> {
  const command = new GetSecretValueCommand(input)
  const { SecretString } = await client.send(command)
  const { 
     cipherIvStr,
     cipherAlgo1,
  } = JSON.parse(SecretString!)

  return new Promise((resolve, reject) => {
    const iv = Buffer.from(cipherIvStr)
    const bufferToken = Buffer.from(token, "hex")
    const encryptedToken = createCipheriv(cipherAlgo1, bufferToken, iv)
      .final().toString("hex")
    resolve(encryptedToken)
    reject()
  })
}

export function generateToken(): string {
  return randomBytes(16).toString("hex")
}

export async function insertEmailVerificationToken(db: Kysely<Database>, email: string): Promise<string> {
  const token = generateToken()
  const encryptedToken = await generateEncryptedToken(token)

  await db
    .insertInto("email_verification_token")
    .values({
      email_address: email,
      encrypted_token: encryptedToken,
    })
    .execute()

  return token
}