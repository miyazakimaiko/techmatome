"use client"
import Header from "@/components/header"
import Link from "next/link"

export default function Subscribed() {
  return (
    <>
      <Header/>
      <main className="grow">
        <h1 className="page-title">あともう少し！</h1>
        <p>登録確認のメールを送信しました。<br/>受信箱を確認してください。</p>
        <div className="max-w-[200px] mx-auto my-8">
          <Link href="">過去のメルマガを読んでみる</Link>
          <Link href="">広告を載せる</Link>
          <Link href="">仕事を探す</Link>
          <Link href="">仕事を載せる</Link>
        </div>
      </main>
    </>
  )
}