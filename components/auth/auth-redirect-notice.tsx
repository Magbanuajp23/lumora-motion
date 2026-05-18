"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

type Notice = {
  tone: "success" | "error";
  title: string;
  message: string;
};

export function AuthRedirectNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleRedirect() {
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const authState = params.get("auth");
      const code = params.get("code");
      const error = params.get("error_description") ?? hash.get("error_description");
      const returnedWithSession = hash.has("access_token") || hash.has("refresh_token");
      const supabase = getSupabaseClient();

      if (error) {
        if (isMounted) {
          setNotice({
            tone: "error",
            title: "Confirmation needs attention",
            message: error.replace(/\+/g, " ")
          });
        }
      } else if (code && supabase) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!isMounted) return;

        if (exchangeError) {
          setNotice({
            tone: "error",
            title: "Confirmation needs attention",
            message: exchangeError.message
          });
        } else {
          setNotice({
            tone: "success",
            title: authState === "google" ? "Signed in with Google" : "Lumora Motion studio unlocked",
            message:
              authState === "google"
                ? "Welcome back. Your Lumora Motion workspace is loading."
                : "Your email is confirmed. The editor is ready when your session finishes syncing."
          });
        }
      } else if (authState === "confirmed" || returnedWithSession) {
        if (isMounted) {
          setNotice({
            tone: "success",
            title: "Lumora Motion studio unlocked",
            message: "Your email is confirmed. The editor is ready when your session finishes syncing."
          });
        }
      } else if (authState === "google") {
        if (isMounted) {
          setNotice({
            tone: "success",
            title: "Signed in with Google",
            message: "Welcome back. Your Lumora Motion workspace is loading."
          });
        }
      }

      if (authState || error || returnedWithSession || code) {
        await supabase?.auth.getSession();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    handleRedirect();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!notice) return null;

  const Icon = notice.tone === "success" ? CheckCircle2 : XCircle;
  const toneClass =
    notice.tone === "success"
      ? "border-signal/30 bg-signal/10 text-signal shadow-[0_0_40px_rgba(111,255,203,0.12)]"
      : "border-rose-400/30 bg-rose-500/10 text-rose-200 shadow-[0_0_40px_rgba(251,113,133,0.12)]";

  return (
    <div className="fixed inset-x-4 top-28 z-[60] mx-auto max-w-xl">
      <div className={`glass-panel flex items-start gap-3 rounded-2xl border px-4 py-4 backdrop-blur-2xl ${toneClass}`}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-[var(--font-space)] text-sm font-black uppercase tracking-[0.18em] text-white">
            {notice.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{notice.message}</p>
        </div>
        <button
          type="button"
          onClick={() => setNotice(null)}
          className="ml-auto rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-white/70 transition hover:border-white/25 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
