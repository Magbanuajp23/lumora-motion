"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppBackground } from "@/components/layout/app-background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSupabaseClient, getSupabaseConfigError } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function prepareRecoverySession() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        if (isMounted) {
          setError(getSupabaseConfigError());
          setIsReady(true);
        }
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const authError = params.get("error_description");

      if (authError) {
        if (isMounted) {
          setError(authError.replace(/\+/g, " "));
          setIsReady(true);
        }
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!isMounted) return;

        if (exchangeError) {
          setError(exchangeError.message);
          setIsReady(true);
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }

      await supabase.auth.getSession();

      if (isMounted) {
        setIsReady(true);
      }
    }

    prepareRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(getSupabaseConfigError());
      setSuccess("");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setNewPassword("");
    setSuccess("Password updated successfully. You can now log in with your new password.");
    setIsSubmitting(false);
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#03050a] text-slate-100">
      <AppBackground />
      <Navbar />
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="particle-field pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-plasma/10 blur-3xl" />
        <div className="relative mx-auto max-w-xl">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-plasma/25 bg-plasma/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-plasma shadow-glow">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Secure recovery
            </div>
            <h1 className="mt-5 font-[var(--font-space)] text-3xl font-black text-white sm:text-4xl">
              Reset your password
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Create a new Lumora Motion password to get back into your AI editing studio.
            </p>

            {success ? (
              <div className="mt-6 rounded-2xl border border-signal/25 bg-signal/10 p-5 shadow-[0_0_50px_rgba(111,255,203,0.12)]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                  <div>
                    <p className="font-[var(--font-space)] text-lg font-black text-white">
                      Password updated
                    </p>
                    <p className="mt-2 text-sm leading-6 text-signal">{success}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/#login")}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-white text-sm font-black text-[#05070d] transition hover:-translate-y-0.5 hover:bg-slate-200"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                    New password
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="min-w-0 flex-1 bg-transparent text-white outline-none"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-plasma/35 hover:bg-plasma/10 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>

                {error ? (
                  <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
                    {error}
                  </div>
                ) : null}

                <button
                  disabled={!isReady || isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#05070d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting || !isReady ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {!isReady ? "Preparing secure session..." : isSubmitting ? "Updating password..." : "Update password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
