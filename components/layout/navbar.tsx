"use client";

import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/lumora-motion-data";
import { getSupabaseClient } from "@/lib/supabase-client";

const loggedOutNavItems = [
  ["Home", "#home"],
  ["Pricing", "#pricing"]
] as const;

const loggedInNavItems = [
  ["Dashboard", "#dashboard"],
  ["Studio", "#studio"],
  ["Credits", "#dashboard"]
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const anchorPrefix = pathname === "/" ? "" : "/";
  const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;
  const logoHref = isLoggedIn ? "#studio" : "#home";

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseClient();

    if (!supabase) return;

    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#03050a]/70 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <a href={`${anchorPrefix}${logoHref}`} className="flex min-w-0 flex-1 items-center">
          <img
            src="/lumora-logo.png"
            alt={`${brand.name} logo`}
            className="h-12 w-auto max-w-[260px] shrink-0 object-contain drop-shadow-[0_0_18px_rgba(32,217,255,0.35)] sm:h-16 lg:h-20"
          />
          <span className="sr-only">{brand.name}</span>
        </a>
        <div className="hidden items-center gap-5 text-sm font-medium text-slate-300 lg:flex">
          {navItems.map(([item, href]) => (
            <a key={item} href={`${anchorPrefix}${href}`} className="transition hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isSigningOut}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:border-plasma/35 hover:bg-plasma/10 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
              Logout
            </button>
          ) : (
            <>
              <a
                href={`${anchorPrefix}#login`}
                className="hidden rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-plasma/35 hover:bg-plasma/10 sm:inline-flex"
              >
                Login
              </a>
              <a
                href={`${anchorPrefix}#signup`}
                className="rounded-lg bg-white px-2.5 py-2 text-xs font-black text-[#05070d] transition hover:-translate-y-0.5 hover:bg-slate-200 min-[390px]:px-3 min-[390px]:text-sm sm:px-4"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
