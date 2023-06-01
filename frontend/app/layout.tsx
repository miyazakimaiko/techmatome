import './globals.css'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Techまとめ | 毎朝５分のインプット',
  description: `無料でサクッと読める、Geek・エンジニアのためのメルマガ📩 英語の最新記事やブログを翻訳、要約して毎朝お届けします🎁`,
}

export default function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet"/>
      </head>
      <body 
        suppressHydrationWarning={true}
        className="flex min-h-screen flex-col items-center justify-between text-base leading-7"
      >
        {children}
        <Footer/>
      </body>
    </html>
  )
}
