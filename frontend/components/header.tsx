"use client"
import Link from "next/link"
import { BaseSyntheticEvent, useState } from "react"

export default function Header() {

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const hamburgerCheckboxClicked = (event: BaseSyntheticEvent) => {
    setMobileNavOpen(event.target.checked);
  }

  return (
    <>
      <header className="w-full flex justify-between flex-none items-center p-2">
        <h1>
          <Link href={"/"}>
            <h1 className="ml-4 font-medium">Techまとめ</h1>
          </Link>
        </h1>

        {/* nav for tablet, desktop */}
        <nav className="items-center hidden sm:flex">
          <Link href={"/archives"} className="mr-4">過去のメルマガ</Link>
          <Link href={"/request-ads"} className="mr-4">広告を出す</Link>
          {/* <Link href={"/"} className="mr-4">仕事をさがす</Link>
          <Link href={"/"} className="subscribe-button">仕事を載せる</Link> */}
        </nav>
        <label 
          id="hamburger"
          htmlFor="hamburger-checkbox"
          className={`flex h-4 w-5 justify-center items-center relative z-50 cursor-pointer sm:hidden` 
            + (mobileNavOpen ? " mobile-nav-open" : "")
          }
        >
          <span className="block h-[2px] w-full bg-[black] transition-all ease-in-out duration-[420ms] absolute top-0"></span>
          <span className="block h-[2px] w-full bg-[black] transition-all ease-in-out duration-[420ms] absolute"></span>
          <span className="block h-[2px] w-full bg-[black] transition-all ease-in-out duration-[420ms] absolute bottom-0"></span>
        </label>
      </header>
      {/* nav for mobile */}
      <div className="mobile-nav w-full sm:hidden">
        <input 
          type="checkbox" 
          id="hamburger-checkbox" 
          checked={mobileNavOpen} 
          onChange={hamburgerCheckboxClicked} 
          className="hidden"
        />
        <nav className={`w-full z-40 bg-white` + (mobileNavOpen ? " block" : " hidden")}>
          <ul className="text-center max-w-[12rem] mx-auto mt-4">
            <li className="my-1">
              <Link href={"/archives"} className="underline p-1">過去のメルマガをみる</Link>
            </li>
            <li className="my-1">
              <Link href={"/request-ads"} className="underline p-1">
                広告を出す
              </Link>
            </li>
            {/* <li className="my-1">
              <Link href={"/"} className="underline p-1">仕事をさがす</Link>
            </li>
            <li className="my-1">
              <Link href={"/"} className="underline p-1">仕事を載せる</Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </>
  )
}