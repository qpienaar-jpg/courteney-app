"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/consult", label: "Consult" },
  { href: "/logbook", label: "Logbook" },
  { href: "/trends", label: "Trends" },
  { href: "/export", label: "Export" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-bold text-courteney-purple-600"
        >
          Courteney
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-courteney-purple-600 ${
                    isActive
                      ? "text-courteney-purple-600 underline decoration-courteney-pink-400 decoration-2 underline-offset-4"
                      : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600 hover:text-courteney-purple-600 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-lg">
          <ul className="flex flex-col py-4 px-6 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-courteney-purple-50 text-courteney-purple-600"
                        : "text-gray-600 hover:bg-courteney-warm-100 hover:text-courteney-purple-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
