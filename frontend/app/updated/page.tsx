"use client"
import Link from "next/link"

export default function Updated() {
  
  return (
    <>
      <main>
        <h1 className="page-title">登録内容を変更しました。</h1>
        <div className="max-w-[200px] mx-auto my-8 flex flex-col underline">
          <Link href="/archives">過去のメルマガを読んでみる</Link>
          {/* <Link href="">広告を載せる</Link>
          <Link href="">仕事を探す</Link>
          <Link href="">仕事を載せる</Link> */}
        </div>
      </main>
    </>
  )
}