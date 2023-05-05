import './globals.css'
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

const notoSans = Noto_Sans_JP({
  weight: ['400', '600'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'TiRO | Geekのためのメルマガ | 毎朝５分のインプット',
  description: `最新記事を読む時間がない。英語だと尚更。TiROは、そんなGeekのための無料メルマガです。
    テクノロジーやプログラミングに関する興味深い記事を、要約・翻訳して 毎朝お届けします。`,
}

export default function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <body className={notoSans.className + " flex min-h-screen flex-col items-center justify-between sm:text-base"}>
        {children}
        <Footer/>
      </body>
    </html>
  )
}
