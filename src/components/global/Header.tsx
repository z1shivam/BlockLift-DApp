import { Galindo } from "next/font/google";
import WalletConnButton from "./WalletConnect";
import Link from "next/link";

export const henny_penny = Galindo({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header
      className={`fixed top-0 h-14 w-full bg-emerald-900 text-2xl text-white z-50`}
    >
      <section className="mx-auto flex h-full max-w-7xl items-center justify-between px-3">
        <Link href={"/"} className="flex items-center gap-3">
          <span className="font-bold">\(o_o)/</span>
          <span className={`${henny_penny.className} mt-1`}>BlockLift</span>
        </Link>
        <WalletConnButton />
      </section>
    </header>
  );
}
