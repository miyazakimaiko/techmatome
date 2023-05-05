import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-2">
      <h1>
        <Link href={"/"}>
          <Image
            src="/tiro-logo.svg"
            alt="TiRO｜Geekのためのメルマガ｜毎朝５分のインプット"
            width={0}
            height={0}
            style={{ height: '100%', width: 'auto' }}
            priority
          />
        </Link>
      </h1>
      <div className="flex items-center">
        <Link href={"/archives"} className="mr-4">過去のサブスク</Link>
        <Link href={"/"} className="mr-4">広告を出す</Link>
        <button type="submit" className="subscribe-button">登録する</button>
      </div>
    </header>
  )
}