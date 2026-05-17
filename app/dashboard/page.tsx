"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { AppBackground } from "@/components/layout/app-background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSection } from "@/components/sections/dashboard-section";
import { getSupabaseClient, getSupabaseConfigError } from "@/lib/supabase-client";

export default function DashboardPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(getSupabaseConfigError());
      setIsLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error: userError }) => {
      if (userError) {
        setError(userError.message);
      }
      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(getSupabaseConfigError());
      return;
    }

    setIsSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setIsSigningOut(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#03050a] text-slate-100">
      <AppBackground />
      <Navbar />
      <section className="relative px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-plasma/25 bg-plasma/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-plasma">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Creator dashboard
            </div>
            <h1 className="mt-4 font-[var(--font-space)] text-3xl font-black text-white sm:text-5xl">
              Lumora Motion workspace
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              {isLoading
                ? "Checking your secure Supabase session..."
                : user
                  ? `Signed in as ${user.email ?? "Lumora creator"}`
                  : "You are viewing the dashboard shell. Sign in from the homepage to connect a Supabase session."}
            </p>
            {error ? (
              <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
                {error}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {isLoading ? (
              <div className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading session
              </div>
            ) : null}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white transition hover:border-plasma/35 hover:bg-plasma/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogOut className="h-4 w-4" aria-hidden="true" />}
                {isSigningOut ? "Signing out..." : "Logout"}
              </button>
            ) : (
              <a href="/#login" className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-black text-[#05070d] transition hover:-translate-y-0.5">
                Sign in
              </a>
            )}
          </div>
        </div>
      </section>
      <DashboardSection />
      <Footer />
    </main>
  );
}
