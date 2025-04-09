"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bottom-[0px] right-[0px] p-[20px] fixed flex flex-col items-end">
      <div className="flex h-[40px]">
        <Link href="/" className={`my-auto ${pathname === "/" ? "text-[24px]" : "text-[16px]"} transition-all duration-300`} >
          HOME
        </Link>
        {pathname === "/" && (
          <div className={`h-[1px] w-[10px] mx-[5px] my-auto bg-white transition-all duration-300 ${pathname === "/" ? "scale-x-[1]" : "scale-x-[0]" }`}></div>
        )}
      </div>
      <div className="flex h-[40px]">
        <Link href="/about" className={`my-auto ${pathname === "/about" ? "text-[24px]" : "text-[16px]"} transition-all duration-300`}>
          ABOUT
        </Link>
        {pathname === "/about" && (
          <div className={`h-[1px] w-[10px] mx-[5px] my-auto bg-white transition-all duration-300 ${pathname === "/about" ? "scale-x-[1]" : "scale-x-[0]" }`}></div>
        )}
      </div>
      <div className="flex h-[40px]">
        <Link href="/skills" className={`my-auto ${pathname === "/skills" ? "text-[24px]" : "text-[16px]"} transition-all duration-300`}>
          SKILLS
        </Link>
        {pathname === "/skills" && (
          <div className={`h-[1px] w-[10px] mx-[5px] my-auto bg-white transition-all duration-300 ${pathname === "/skills" ? "scale-x-[1]" : "scale-x-[0]" }`}></div>
        )}
      </div>
    </div>
  );
}
