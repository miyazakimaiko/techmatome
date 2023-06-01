"use client"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import validateEmail from "@/functions/validateEmail"
import resendVerificationEmail from "@/functions/resendVerificationEmail"

export default function Subscribed() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [resent, setResent] = useState(false)
  const [error, setError] = useState(false)
  const [resending, setResending] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)

  useEffect(() => {
    if (email) {
      validateEmail(email).then(() => setEmailValidated(true))
    }
  }, [email])

  async function resendVerificationButtonOnClick(event: BaseSyntheticEvent) {
    event.preventDefault()
    if (email && emailValidated) {
      try {
          setResending(true)
          await resendVerificationEmail(email)
      } catch (error) {
        setResending(false)
        setError(true)
      }
      setResending(false)
      setResent(true)
    }
  }

  const errorMessage = (
    <div className="text-sm text-left max-w-md bg-black bg-opacity-5 py-2 px-4 mx-auto mt-6">
      <div className="font-medium">再送に失敗しました。</div>
      <p>後ほど再度登録の手順を踏んでいただくか、miyazaki@techmatome.comへご連絡いただけると幸いです。</p>
    </div>
  )

  const beforeResentHelpMessage = (
    <div className="text-sm text-left max-w-md bg-black bg-opacity-5 py-2 px-4 mx-auto mt-6">
      <div className="font-medium">メールが届かない場合</div>
      <p>迷惑メール・プロモーションメールボックスに届いていませんか？<br/>
      届くまでに数分かかることがございます。<br/>
      届かない場合は、こちらから再送をお願いします。
        <button 
          type="button" 
          onClick={resendVerificationButtonOnClick}
          className="border px-2 bg-[white]"
        >再送する</button>
      </p>
    </div>
  )

  const resendingSpinner = (
      <div className="flex mt-6 mx-auto">
        <Image
          src="/processing.svg"
          alt="processing"
          className="animate-spin mr-2"
          width={26}
          height={26}
        />
        再送しています...
      </div>
  )

  const afterResentHelpMessage = (
    <div className="text-sm text-left max-w-md bg-black bg-opacity-5 py-2 px-4 mx-auto mt-6">
      <div className="font-medium">確認メールを再送しました。</div>
        <p>届くまでに数分かかることがございます。<br/>
        それでも届かない場合、再度登録の手順を踏んでいただくか、miyazaki@techmatome.comへご連絡いただけると幸いです。</p>
    </div>
  )
  
  return (
    <>
      <main>
        <p>確認メールを {emailValidated ? `${email} へ` : null} 送信しました。<br/>メールの手順に従って登録を完了してください。</p>
        {
          error ? errorMessage :
          resending ? resendingSpinner :
          resent ? afterResentHelpMessage : beforeResentHelpMessage
        }
      </main>
    </>
  )
}