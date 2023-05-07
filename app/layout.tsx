import './globals.css'
import Footer from '@/components/footer'

export const metadata = {
  title: 'TiRO | Geekのための 📩 毎朝５分のインプット',
  description: `最新記事を読む時間がない。英語だと尚更。TiROは、そんなGeekのための無料メルマガです。
    テクノロジーやプログラミングに関する興味深い記事を、要約・翻訳して 毎朝お届けします。`,
}

export default function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body className="flex min-h-screen flex-col items-center justify-between text-base">
        {children}
        <Footer/>
      </body>
    </html>
  )
}
