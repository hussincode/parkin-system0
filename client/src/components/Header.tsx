import React from "react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 w-24 h-24">
          <img src="/imglogo.jpg" alt="Smart Parking System Logo" />
        </div>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/">
            <a className="hover:underline">Home</a>
          </Link>
          <Link href="/scan">
            <a className="hover:underline">Scanner</a>
          </Link>
          <Link href="/register">
            <a className="hover:underline">Register</a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
