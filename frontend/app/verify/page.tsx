"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import verifySubscriber from "@/functions/verifySubscriber"

export default function Verify() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const [processing, setProcessing] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    async function verify(email: string, token: string) {
      const res = await verifySubscriber(email, token)
      setVerified(res.success)
      setProcessing(false)
    }
    if (email && token) {
      verify(email, token)
    }
  }, [email, token])
  
  return (
    <>
      <main>
        <p>
          {processing 
            ? `確認しています...` 
            : verified 
              ? `登録完了しました🎉` 
              : `【無効のリンク】再び登録の手順を踏んでいただくか、miyazaki@techmatome.comへご連絡ください。`}
        </p>
        {verified 
          ? <div className="max-w-[200px] mx-auto my-8 flex flex-col underline">
              <Link href="/archives">過去のメルマガを読んでみる</Link>
              <Link href="">広告を載せる</Link>
              <Link href="">仕事を探す</Link>
              <Link href="">仕事を載せる</Link>
            </div>
          : null}
      </main>
    </>
  )
}