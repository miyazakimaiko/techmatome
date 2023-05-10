import SubscribeSection from '@/components/subscribeSection'
import Image from 'next/image'

export default function Home() {

  const title = (
    <div className="flex flex-col items-center justify-between pt-4 sm:pt-8">
      <h1>
        <Image
          src="/tiro-logo.svg"
          alt="TiRO｜Geekのためのメルマガ｜毎朝５分のインプット"
          width={130}
          height={24}
          priority
        />
      </h1>
      <p className="text-sm pt-2">毎朝５分のインプット</p>
    </div>
  )

  const emojis = (
    <div className="w-full max-w-[300px] m-auto flex justify-evenly text-5xl py-10">
      <div className="animate-bounce">⏱</div>
      <span className="animate-bounce animation-bounce-delay">📱</span>
      <span className="animate-bounce">👨🏻‍💻</span>
      <span className="animate-bounce animation-bounce-delay">💡</span>
    </div>
  )

  const introText = (
    <div className="text-center pb-8">
      <p className="pb-6">
        最新記事を読む時間がない。<strong>英語だと尚更。</strong><br/>TiROは、そんな<strong>Geekのための無料メルマガ</strong>です。
      </p>
      <p>
        テクノロジーやプログラミングに関する<br/>興味深い記事を<strong>要約・翻訳</strong>して 毎朝お届けします。
      </p>
    </div>
  )

  return (
    <main>
      {title}
      {emojis}
      {introText}
      <SubscribeSection />
    </main>
  )
}
