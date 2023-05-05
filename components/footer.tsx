import Link from "next/link"

export default function Footer() {
  return (
    <footer className="pb-2 text-xs">
      <Link href={"/privacy"} className="mx-2 underline">プライバシー</Link>
      <Link href={"/terms"} className="mx-2 underline">利用規約</Link>
    </footer>
  )
}