import { Config } from 'sst/node/config'
import { createCipheriv, createDecipheriv } from "crypto"

const CIPHER_ALGO = Config.PUBLIC_CIPHER_ALGO
const CIPHER_KEY_STR = Config.PUBLIC_CIPHER_KEY_STR
const CIPHER_IV_STR = Config.PUBLIC_CIPHER_IV_STR

//Encrypting text
export async function encrypt(text: string) {

   const key = Buffer.from(CIPHER_KEY_STR)
   const iv = Buffer.from(CIPHER_IV_STR)

   const cipher = createCipheriv(CIPHER_ALGO, key, iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return encrypted.toString('hex');
}

// Decrypting text
export async function decrypt(encrypted: string) {

   const key = Buffer.from(CIPHER_KEY_STR)
   const iv = Buffer.from(CIPHER_IV_STR)

   const encryptedText = Buffer.from(encrypted, 'hex');
   const decipher = createDecipheriv(CIPHER_ALGO, Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}