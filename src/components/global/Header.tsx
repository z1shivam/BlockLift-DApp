import { Galindo } from "next/font/google";
import WalletConnButton from "./WalletConnect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const henny_penny = Galindo({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header
      className={`fixed top-0 h-14 w-full bg-emerald-900 text-white z-50`}
    >
      <section className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-3">
        <span className="text-2xl font-bold">\(o_o)/</span>
          <span className={`${henny_penny.className} text-2xl mt-1`}>BlockLift</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/campaigns" className="text-emerald-100 hover:text-white transition-colors hover:underline">
            Campaigns
          </Link>
          <Link href="/dashboard" className="text-emerald-100 hover:text-white transition-colors hover:underline">
            Dashboard
          </Link>
          <Link href="/about" className="text-emerald-100 hover:text-white transition-colors hover:underline">
            About
          </Link>
          <Link href="/docs" className="text-emerald-100 hover:text-white transition-colors hover:underline">
            Docs
          </Link>
          <Link href="/help" className="text-emerald-100 hover:text-white transition-colors hover:underline">
            Help
          </Link>
        </nav>

        {/* Mobile Navigation & Wallet */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-emerald-800 hover:bg-emerald-700 text-white">
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/campaigns"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Campaigns</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse and support campaigns
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/dashboard"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Dashboard</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Your contribution history
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/about"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">About</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn about our team
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/docs"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Docs</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Guides and documentation
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/help"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Help</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get support and FAQ
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <WalletConnButton />
        </div>
      </section>
    </header>
  );
}
