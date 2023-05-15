import { createCipheriv, createDecipheriv } from "crypto"
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

const client = new SecretsManagerClient({ region: "ap-northeast-1" })
const input = { 
  SecretId: "crypto/cipher",
}

//Encrypting text
export async function encrypt(text: string) {
   const command = new GetSecretValueCommand(input)
   const { SecretString } = await client.send(command)
   const { 
      cipherKeyStr, 
      cipherIvStr,
      cipherAlgo2,
   } = JSON.parse(SecretString!)

   const key = Buffer.from(cipherKeyStr)
   const iv = Buffer.from(cipherIvStr)

   const cipher = createCipheriv(cipherAlgo2, key, iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return encrypted.toString('hex');
}

// Decrypting text
export async function decrypt(encrypted: string) {
   const command = new GetSecretValueCommand(input)
   const { SecretString } = await client.send(command)
   const { 
      cipherKeyStr, 
      cipherIvStr,
      cipherAlgo2,
   } = JSON.parse(SecretString!)

   const key = Buffer.from(cipherKeyStr)
   const iv = Buffer.from(cipherIvStr)

   const encryptedText = Buffer.from(encrypted, 'hex');
   const decipher = createDecipheriv(cipherAlgo2, Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}