import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AlertTriangle, ArrowRight, Moon, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const GATE_KEY = "gwave-age-gate-v1";

export function AgeGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const confirmAge = trpc.gwave.age.confirm.useMutation();
  const [hydrated, setHydrated] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setHasConfirmed(window.localStorage.getItem(GATE_KEY) === "confirmed");
    setHydrated(true);
  }, []);

  const confirm = () => {
    if (!acknowledged) return;
    window.localStorage.setItem(GATE_KEY, "confirmed");
    setHasConfirmed(true);
    if (isAuthenticated) confirmAge.mutate({ acknowledged: true });
  };

  if (!hydrated || !hasConfirmed) {
    return (
      <div className="fixed inset-0 z-[100] grid min-h-screen place-items-center overflow-y-auto bg-black px-4 py-8 text-white">
        <div className="absolute left-0 top-0 h-2 w-full bg-[#8bd32c]" />
        <div className="grid w-full max-w-3xl gap-8 border border-white/25 bg-[#090909] p-6 shadow-[16px_16px_0_#8bd32c] sm:p-10">
          <div className="flex items-start justify-between gap-6 border-b border-white/20 pb-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8bd32c]">{t("accessControl")}</p><div className="flex items-center gap-2"><LanguageSwitcher compact /><button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Light mode" : "Dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"} className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-[#8bd32c] hover:text-[#8bd32c]">{theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</button></div></div>
              <div className="mt-3 flex items-center gap-4"><img src="/manus-storage/gwave-logo-green_9123ef02.png" alt="Gwave" className="size-16 object-contain" /><h1 className="font-display text-6xl font-black uppercase leading-[0.8] tracking-[-0.08em] sm:text-8xl">GWAVE</h1></div>
            </div>
            <ShieldCheck className="mt-1 size-9 shrink-0 text-[#8bd32c]" aria-hidden="true" />
          </div>
          <div className="grid gap-5 md:grid-cols-[1fr_1.15fr] md:gap-12">
            <div>
              <p className="font-display text-3xl font-bold uppercase leading-none">{t("ageRequired")}</p>
              <p className="mt-4 text-sm leading-6 text-white/65">{t("ageIntro")}</p>
            </div>
            <div className="grid gap-5">
              <label className="flex cursor-pointer items-start gap-3 border border-white/20 bg-white/[0.03] p-4 text-sm leading-6 transition hover:border-white/50">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={event => setAcknowledged(event.target.checked)}
                  className="mt-1 size-4 accent-[#8bd32c]"
                />
                <span>{t("confirmAge")}</span>
              </label>
              <button
                type="button"
                disabled={!acknowledged || confirmAge.isPending}
                onClick={confirm}
                className="group flex items-center justify-between bg-[#8bd32c] px-5 py-4 text-left font-display text-xl font-black uppercase tracking-tight text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {confirmAge.isPending ? t("verifying") : t("enterGwave")}
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </button>
              <p className="flex gap-2 text-xs leading-5 text-white/50"><AlertTriangle className="mt-0.5 size-3 shrink-0 text-[#8bd32c]" />{t("ageNotice")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
