"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import { FindSubscriberPayload } from "@/interfaces/findSubscriberPayload"
import { Subscriber } from "@/interfaces/subscriber"
import addUpdateSubscriber from "@/functions/addUpdateSubscriber"
import findSubscriber from "@/functions/findSubscriber"

export default function Subscribing() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribeToWeb, setSubscribeToWeb] = useState(false)
  const [subscribeToAi, setSubscribeToAi] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(false)

  const { push } = useRouter();

  useEffect(() => {   
    async function find(email: string): Promise<FindSubscriberPayload> {
      return new Promise(async (resolve, reject) => {
        const subscriber = await findSubscriber(email)
        if (subscriber) resolve(subscriber)
        else reject()
      })
    }

    function setSubscribedCategory(subscriber: FindSubscriberPayload) {
      setSubscribeToWeb(subscriber.data?.web_subscribed === 1)
      setSubscribeToAi(subscriber.data?.ai_subscribed === 1)
    }

    if (email) {
      find(email)
        .then((subscriber) => {
          setIsSubscribed(subscriber.found)
          setSubscribedCategory(subscriber)
        }, () => setError(true))
        .catch(() => setError(true))
        .finally(() => {
          setLoading(false)
          setProcessing(false)
        })
    }
  }, [email])

  async function subscribe(event: BaseSyntheticEvent) {
    event.preventDefault()

    try {
      setProcessing(true)
      const res = await addUpdateSubscriber(isSubscribed, {
        email_address: email,
        tech_subscribed: 1,
        web_subscribed: subscribeToWeb ? 1 : 0,
        ai_subscribed: subscribeToAi ? 1 : 0,
      } as Subscriber)

      if (res.success) {
        if (res.type === "created"|| !res.verified) {
          push(`/subscribed?email=${email}`)
        } 
        else if (res.type === "updated") {
          push(`/updated`)
        }
      }

    } catch (e: any) {
      console.error({e})
      setError(true)
    }
  }

  const selections = (
    <div className="max-w-[200px] mx-auto my-8">
      <input type="checkbox" id="box-1" checked disabled/>
      <label htmlFor="box-1">テクノロジー全般 💻</label>
      <input 
        type="checkbox" 
        id="box-2"
        disabled={processing}
        checked={subscribeToWeb}
        onChange={e => setSubscribeToWeb(e.target.checked)}
      />
      <label htmlFor="box-2">Web制作・Web開発 👨‍💻</label>
      {/* <input 
        type="checkbox"
        id="box-3"
        disabled={processing}
        checked={subscribeToAi}
        onChange={e => setSubscribeToAi(e.target.checked)}
      />
      <label htmlFor="box-3">AI・機械学習 🧠</label> */}
    </div>
  )

  const submitSection = (
    <>
      <div className={error ? "hidden" : "block"}>
        <button 
          type="submit" 
          title="登録" 
          className="subscribe-button mx-auto min-w-[123.4px]"
          disabled={processing}
          onClick={subscribe}
        >
          {processing 
            ? (
              <>
                <Image
                  src="/processing.svg"
                  alt="processing"
                  className="animate-spin mr-1"
                  width={16}
                  height={16}
                /> <>登録しています…</>
              </>
            ) : `登録を完了する`}
        </button>
      </div>
      <div className={error ? " block" : " hidden"}>
        <div className="text-red-600 font-semibold pb-4">
          登録に失敗しました。メールアドレスを今一度ご確認の上、後ほど再度登録をお願いいたします。
        </div>
        <Link href="/" className="underline">戻る</Link>
      </div>
    </>
  )

  return (
    <>
      <main>
        {
          loading
            ? <div className="mx-auto mt-8">
                <Image
                  src="/processing.svg"
                  alt="processing"
                  className="animate-spin"
                  width={40}
                  height={40}
                />
              </div>
            : <>
                <h1 className="page-title">受け取るメルマガのカテゴリを追加しませんか？</h1>
                <p>テクノロジー全般のほか、特定のジャンルに絞ったメルマガも配信しています。</p>
                {selections}
                {submitSection}
              </>
        }

      </main>

    </>
  )
}