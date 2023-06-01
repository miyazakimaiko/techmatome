import { Article, Contents, Metadata } from "core/interfaces"
import combineBlocksIntoDailyNewsHtml from "generators/combineBlocksIntoDailyNewsHtml"

function generatePreheaderBlock(text: string) {
  return `
    <table width="100%">
      <tr>
        <td class="preheader" style="display:none !important; visibility:hidden; height:0; width:0; font-size:0; color:transparent; color:rgba(0,0,0,0); opacity:0; mso-hide:all;"><font size="1" color="#666666">${text}</font></td>
      </tr>
    </table>
  `
}

function generateMenuBlock() {
  return `
    <div class="spacer_block block-1" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
    <table class="menu_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
              <td class="alignment" style="text-align:center;font-size:0px;">
                <div class="menu-links"><!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style=""><tr style="text-align:center;"><![endif]--><!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="https://techmatome.com" target="_self" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#0e0e0e;font-family:Arial, Helvetica, sans-serif;font-size:13px;text-decoration:none;letter-spacing:normal;">ブラウザで読む</a><!--[if mso]></td><td><![endif]--><span class="sep" style="font-size:13px;font-family:Arial, Helvetica, sans-serif;color:#101112;">｜</span><!--[if mso]></td><![endif]--><!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="https://techmatome.com" target="_self" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#0e0e0e;font-family:Arial, Helvetica, sans-serif;font-size:13px;text-decoration:none;letter-spacing:normal;">メルマガ一覧</a><!--[if mso]></td><td><![endif]--><span class="sep" style="font-size:13px;font-family:Arial, Helvetica, sans-serif;color:#101112;">｜</span><!--[if mso]></td><![endif]--><!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="https://docs.google.com/forms/d/e/1FAIpQLSe1elz3gKzyLDOTTAULu1qONCP3K0BzZiUbm-TzRQ4kh1bp-Q/viewform?usp=sf_link" target="_self" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#0e0e0e;font-family:Arial, Helvetica, sans-serif;font-size:13px;text-decoration:none;letter-spacing:normal;">広告を載せる</a><!--[if mso]></td><![endif]--><!--[if mso]></tr></table><![endif]--></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div class="spacer_block block-3" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
  `
}

function generateMainHeadingBlock(metadata: Metadata) {
  const { category, date } = metadata
  return `
    <div class="spacer_block block-4" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
    <table class="heading_block block-4" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <h1 style="margin: 0; color: #060606; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
            <strong><span class="tinyMce-placeholder">${category}まとめ</span></strong>
          </h1>
        </td>
      </tr>
    </table>
    <table class="heading_block block-5" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <h1 style="margin: 0; color: #060606; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
            <strong><span class="tinyMce-placeholder">${date}</span></strong> 
          </h1>
        </td>
      </tr>
    </table>
    <div class="spacer_block block-6" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
    <table class="divider_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <div class="alignment" align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tr>
                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  `
}

function generateSectionHeadingBlock(icon: string, heading: string) {

  icon = icon.replace("<icon>", "").replace("</icon>", "")

  return `
    <div class="spacer_block block-7" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
    <table class="heading_block block-8" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <h1 style="margin: 0; color: #8a3c90; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
            <span class="tinyMce-placeholder">${icon}</span>
          </h1>
        </td>
      </tr>
    </table>
    <table class="heading_block block-9" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <h1 style="margin: 0; color: #060606; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
            ${heading}
          </h1>
        </td>
      </tr>
    </table>
  `
}

function generateArticleBlock(article: Article) {
  const { heading, paragraph } = article

  const regExpForText = /\[([^)]+)\]/g
  const headingText = regExpForText.exec(heading)

  const regExpForLink = /\(([^)]+)\)/g
  const headingLink = regExpForLink.exec(heading)

  if (!headingText || !headingText[1] 
    || !headingLink || !headingLink[1]
  ) {
    throw new Error(`Wrong format section heading: ${heading} | It has to be with a link.`)
  }

  return `
    <div class="spacer_block block-10" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
    <table class="heading_block block-11" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td class="pad">
          <h2 style="margin: 0; color: #060606; direction: ltr; font-family: メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro,Osaka, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
            <a href="${headingLink[1]}" style="text-decoration: underline; color: #060606;">
              ${headingText[1]}&nbsp;
            </a>
          </h2>
        </td>
      </tr>
    </table>
    <div class="spacer_block block-12" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
    <table class="paragraph_block block-13" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
      <tr>
        <td class="pad">
          <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
            <p style="margin: 0;">
              ${paragraph}
            </p>
          </div>
        </td>
      </tr>
    </table>
  `
}

async function generateEndingBlock() {
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN

  return `
    <div class="spacer_block block-28" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
    <table class="paragraph_block block-29" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
      <tr>
        <td class="pad">
          <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
            <p style="margin: 0; margin-bottom: 16px;">Techまとめをお読み頂きありがとうございます！</p>
            <p style="margin: 0; margin-bottom: 16px;">ご意見・ご感想等は、ぜひこのメールに返信していただけたら幸いです。</p>
            <p style="margin: 0;">Techまとめ編集　宮崎</p>
          </div>
        </td>
      </tr>
    </table>
    <div class="spacer_block block-30" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
    <table class="paragraph_block block-31" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
      <tr>
        <td class="pad">
          <div style="color:#9a9a9a;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:center;mso-line-height-alt:28.8px;">
            <p style="margin: 0;">配信停止をご希望の場合は、<a href="${siteUrl}/{{dynamicUnsubscribeEndpoint}}">こちら</a>からお願いいたします。</p>
          </div>
        </td>
      </tr>
    </table>
  `
}

export default async function convertObjectToEmailHtml(contents: Contents)
  : Promise<{date: string, subject: string, html: string}> {

  const { metadata, sections } = contents
  let html = ""

  try {
    const preheaderBlock = generatePreheaderBlock(sections[0].articles[0].paragraph.slice(0, 180))
    const menuBlock = generateMenuBlock()
    const mainHeadingBlock = generateMainHeadingBlock(metadata)
    let sectionsBlock = ""
    const endingBlock = await generateEndingBlock()
  
    for(const section of sections) {
      sectionsBlock += generateSectionHeadingBlock(section.icon, section.heading)
  
      for(const article of section.articles) {
        sectionsBlock += generateArticleBlock(article)
      }
    }
  
    html = combineBlocksIntoDailyNewsHtml(
      preheaderBlock,
      menuBlock, 
      mainHeadingBlock, 
      sectionsBlock, 
      endingBlock
    )

  } catch (error: any) {
    throw new Error(error)
  }
  return { 
    date: metadata.date,
    subject: metadata.subject, 
    html
  }
}