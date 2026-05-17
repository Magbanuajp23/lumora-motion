"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { brand } from "@/lib/lumora-motion-data";
import { getSupabaseClient, getSupabaseConfigError } from "@/lib/supabase-client";

type AuthMode = "login" | "signup";
type AuthState = {
  error: string;
  loading: boolean;
  success: string;
};

export function AuthSection() {
  const router = useRouter();
  const [authState, setAuthState] = useState<Record<AuthMode, AuthState>>({
    login: { error: "", loading: false, success: "" },
    signup: { error: "", loading: false, success: "" }
  });

  function updateState(mode: AuthMode, next: Partial<AuthState>) {
    setAuthState((current) => ({
      ...current,
      [mode]: {
        ...current[mode],
        ...next
      }
    }));
  }

  async function handleEmailAuth(mode: AuthMode, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();

    if (!supabase) {
      updateState(mode, { error: getSupabaseConfigError(), loading: false, success: "" });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      updateState(mode, { error: "Enter both email and password.", loading: false, success: "" });
      return;
    }

    updateState(mode, { error: "", loading: true, success: "" });

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`
            }
          });

    if (result.error) {
      updateState(mode, { error: result.error.message, loading: false, success: "" });
      return;
    }

    updateState(mode, {
      error: "",
      loading: false,
      success: mode === "login" ? "Logged in. Opening your dashboard..." : "Account created. Opening your dashboard..."
    });
    router.push("/dashboard");
  }

  async function handleGoogleAuth(mode: AuthMode) {
    const supabase = getSupabaseClient();

    if (!supabase) {
      updateState(mode, { error: getSupabaseConfigError(), loading: false, success: "" });
      return;
    }

    updateState(mode, { error: "", loading: true, success: "" });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      updateState(mode, { error: error.message, loading: false, success: "" });
    }
  }

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Auth" title="Futuristic login and sign up" copy="Create your creator workspace with email or Google OAuth, then jump into the Lumora Motion dashboard." />
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {[
          ["login", "Welcome back", "Login"] as const,
          ["signup", "Create your studio", "Sign Up"] as const
        ].map(([id, title, action]) => {
          const state = authState[id];

          return (
          <form key={id} id={id} className="glass-panel rounded-3xl p-6" onSubmit={(event) => handleEmailAuth(id, event)}>
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">{title}</h3>
            <div className="mt-6 space-y-3">
              <label className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Mail className="h-4 w-4" />Email</span>
                <input name="email" type="email" autoComplete="email" className="mt-2 w-full bg-transparent text-white outline-none" placeholder={brand.emailPlaceholder} />
              </label>
              <label className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Lock className="h-4 w-4" />Password</span>
                <input name="password" type="password" autoComplete={id === "login" ? "current-password" : "new-password"} className="mt-2 w-full bg-transparent text-white outline-none" placeholder="Password" />
              </label>
            </div>
            {state.error ? (
              <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
                {state.error}
              </div>
            ) : null}
            {state.success ? (
              <div className="mt-4 rounded-xl border border-signal/25 bg-signal/10 px-4 py-3 text-sm leading-6 text-signal">
                {state.success}
              </div>
            ) : null}
            <button disabled={state.loading} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#05070d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {state.loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {state.loading ? "Authenticating..." : action}
            </button>
            <div className="mt-4">
              <button type="button" disabled={state.loading} onClick={() => handleGoogleAuth(id)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white transition hover:border-plasma/35 hover:bg-plasma/10 disabled:cursor-not-allowed disabled:opacity-60">
                Continue with Google
              </button>
            </div>
          </form>
        );
        })}
      </div>
    </section>
  );
}
