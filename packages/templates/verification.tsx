import { Config } from 'sst/node/config'

declare module "sst/node/config" {
  export interface ConfigTypes {
    "PUBLIC_DOMAIN": string
  }
}

const PUBLIC_DOMAIN = Config.PUBLIC_DOMAIN

export default async function getVerificationTemplates(email: string, token: string): 
  Promise<{html: string, text: string}> {

  const verificationLink = `
    ${PUBLIC_DOMAIN}/verify?email=${email}&token=${token}
  `

  const html = `
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>【登録を完了してください】TiROニュースまとめ</title>
    </head>
    <body>
      <p>ご登録ありがとうございます。
        <br/>
        以下のリンクにアクセスしていただくと、登録完了となります。
        <br/><br/>
        <a href=${verificationLink}>${verificationLink}</a>
        <br/><br/>
        このリンクは１０分後に無効となります。
        <br/><br/>
        【エラーが発生した場合や、リンクが無効になってしまった場合】
        <br/>
        お手数ですが再び登録の手順を踏んでいただくか、support@tiro.newsへご連絡いただければ幸いです。
        <br/><br/>
        TiROサポート
      </p>  
    </body>
  </html>
`

  const text = `
    ご登録ありがとうございます。次のリンクにアクセスしていただくと、登録完了となります。
    ${verificationLink}
    このリンクは１０分後に無効となります。エラーが発生した場合や、リンクが無効になってしまった場合は、
    お手数ですが再び登録の手順を踏んでいただくか、support@tiro.newsへご連絡いただければ幸いです。
    TiROサポート
  `

  return { html, text }
}