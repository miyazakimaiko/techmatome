import { Config, StackContext } from "sst/constructs"

export function ConfigStack({ stack }: StackContext) {
  
  if (!process.env.PUBLIC_DOMAIN) {
    throw new Error("PUBLIC_DOMAIN is not set")
  }

  const domainParam = new Config.Parameter(stack, "PUBLIC_DOMAIN", {
    value: 
      stack.stage === "prod" 
      ? process.env.PUBLIC_DOMAIN 
      : `http://localhost:3000`,
  })

  if (!process.env.CIPHER_ALGO) {
    throw new Error("CIPHER_ALGO is not set")
  }

  const cipherAlgoParam = new Config.Parameter(stack, "PUBLIC_CIPHER_ALGO", {
    value: process.env.CIPHER_ALGO,
  })


  if (!process.env.CIPHER_KEY) {
    throw new Error("CIPHER_KEY is not set")
  }

  const cipherKeyParam = new Config.Parameter(stack, "PUBLIC_CIPHER_KEY_STR", {
    value: process.env.CIPHER_KEY,
  })

  if (!process.env.CIPHER_IV) {
    throw new Error("CIPHER_IV is not set")
  }

  const cipherIvParam = new Config.Parameter(stack, "PUBLIC_CIPHER_IV_STR", {
    value: process.env.CIPHER_IV,
  })

  if (!process.env.DB_API_KEY) {
    throw new Error("DB_API_KEY is not set")
  }
  const xataApiKeyParam = new Config.Parameter(stack, "DB_API_KEY", {
    value: process.env.DB_API_KEY,
  })

  return {
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
    xataApiKeyParam,
  }
}
