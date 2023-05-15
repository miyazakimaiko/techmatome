"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import validateEmail from "@/functions/validateEmail"

export default function Subscribed() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [emailValidated, setEmailValidated] = useState(false)

  useEffect(() => {
    if (email) {
      validateEmail(email).then(() => setEmailValidated(true))
    }
  }, [email])
  
  return (
    <>
      <main>
        <p>確認リンクを {emailValidated ? `${email} へ` : null} 送信しました。<br/>メールの手順に従って登録を完了してください。</p>
        <div className="max-w-[200px] mx-auto my-8 flex flex-col underline">
          <Link href="/archives">過去のメルマガを読んでみる</Link>
          <Link href="">広告を載せる</Link>
          <Link href="">仕事を探す</Link>
          <Link href="">仕事を載せる</Link>
        </div>
      </main>
    </>
  )
}