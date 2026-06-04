import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { HomeIcon, Sprout } from "lucide-react";
import ModeToggle from "./ModeToggle";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold font-mono tracking-wider">
              My CRUD App
            </Link>
          </div>

          {/* Nav Links + Auth + Toggle */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/BuyOurServices">
                <HomeIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Buy Our Services</span>
              </Link>
            </Button>


            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm h-9 px-4 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;