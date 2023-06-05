import { Config, StackContext } from "sst/constructs"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

export function ConfigStack({ stack }: StackContext) {

  const cipherSecrets = Secret.fromSecretNameV2(
    stack,
    'cipherSecrets',
    'techmatome/cipher',
  )

  const cipherAlgo = cipherSecrets.secretValueFromJson('cipherAlgo').toString()
  const cipherKey = cipherSecrets.secretValueFromJson('cipherKey').toString()
  const cipherIv = cipherSecrets.secretValueFromJson('cipherIv').toString()
  
  const domainParam = new Config.Parameter(stack, "PUBLIC_DOMAIN", {
    value: stack.stage === "prod" 
      ? `https://techmatome.com` : `http://localhost:3000`,
  })

  const cipherAlgoParam = new Config.Parameter(stack, "PUBLIC_CIPHER_ALGO", {
    value: cipherAlgo,
  })

  const cipherKeyParam = new Config.Parameter(stack, "PUBLIC_CIPHER_KEY_STR", {
    value: cipherKey,
  })

  const cipherIvParam = new Config.Parameter(stack, "PUBLIC_CIPHER_IV_STR", {
    value: cipherIv,
  })

  return {
    domainParam,
    cipherAlgoParam,
    cipherKeyParam,
    cipherIvParam,
  }
}
