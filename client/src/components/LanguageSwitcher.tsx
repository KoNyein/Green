import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className={`inline-flex items-center gap-1 border border-white/20 bg-[#111] p-1 ${compact ? "h-9" : "h-11"}`} aria-label={t("language")}>
      <span className="sr-only">{t("language")}</span>
      <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`h-full min-w-10 px-3 font-mono text-[10px] font-bold tracking-[.12em] transition-colors ${language === "en" ? "bg-[#8bd32c] text-black" : "text-white/50 hover:text-white"}`}>EN</button>
      <button type="button" onClick={() => setLanguage("my")} aria-pressed={language === "my"} className={`h-full min-w-14 px-3 font-mono text-[10px] font-bold tracking-[.08em] transition-colors ${language === "my" ? "bg-[#8bd32c] text-black" : "text-white/50 hover:text-white"}`}>မြန်မာ</button>
    </div>
  );
}
