import SubscribeSection from '@/components/subscribeSection'
import Image from 'next/image'

export default function Home() {

  const title = (
    <div className="flex flex-col items-center justify-between pt-4 sm:pt-8">
      <h1>
        <Image
          src="/Techまとめ.png"
          alt="Techまとめ"
          width={290}
          height={82}
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
        無料でサクッと読める、<br/>Geek・エンジニアのためのメルマガ📩
        <br/>英語の最新記事やブログを翻訳、要約して毎朝お届けします🎁
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
