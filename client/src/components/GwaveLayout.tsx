import { startLogin } from "@/const";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GwaveLogo } from "@/components/GwaveLogo";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  ["Store", "/store"],
  ["Knowledge", "/knowledge"],
  ["Newsfeed", "/news"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Help", "/help"],
  ["Roadmap", "/roadmap"],
] as const;

function translatedLabel(label: string, t: ReturnType<typeof useLanguage>["t"]) {
  if (label === "Help") return t("help");
  if (label === "Roadmap") return t("roadmap");
  return label;
}

export function GwaveLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const themeLabel = theme === "dark" ? "Light mode" : "Dark mode";
  const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className={`inline-flex items-center gap-2 border border-white/20 px-3 font-mono text-[10px] uppercase tracking-[.12em] transition-colors hover:border-[#8bd32c] hover:text-[#8bd32c] ${mobile ? "h-11" : "h-9"}`}><span className="grid size-5 place-items-center border border-current/30">{theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}</span><span className="hidden md:inline">{theme === "dark" ? "Light" : "Dark"}</span><span className="md:hidden">{theme === "dark" ? "☼" : "◐"}</span></button>;

  return <div className="min-h-screen bg-black text-white">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Gwave home"><GwaveLogo className="size-8 md:size-9" /><span className="font-display text-3xl font-black tracking-[-0.12em] md:text-4xl">GWAVE</span></Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:text-[#8bd32c] ${location === href ? "text-[#8bd32c]" : "text-white/62"}`}>{translatedLabel(label, t)}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <LanguageSwitcher compact />
          <ThemeToggle />
          {isAuthenticated ? <Link href="/orders" className="border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[#8bd32c] hover:text-[#8bd32c]">{user?.name?.split(" ")[0] || t("myOrders")}</Link> : <button onClick={startLogin} className="border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[#8bd32c] hover:text-[#8bd32c]">{t("signIn")}</button>}
          <Link href="/contact" className="bg-[#8bd32c] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-white">{t("contact")}</Link>
        </div>
        <button onClick={() => setOpen(value => !value)} className="grid size-10 place-items-center border border-white/20 transition-colors hover:border-[#8bd32c] lg:hidden" aria-label={t("menu")} aria-expanded={open}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#0b0b0b] px-4 pb-7 pt-4 lg:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#8bd32c]">Navigation / 01</p><div className="flex items-center gap-2"><LanguageSwitcher /><ThemeToggle mobile /></div></div>
        <nav className="mt-2" aria-label="Mobile navigation">
          {links.map(([label, href], index) => <Link onClick={() => setOpen(false)} key={href} href={href} className={`flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-bold uppercase tracking-[-.02em] transition-colors hover:text-[#8bd32c] ${location === href ? "text-[#8bd32c]" : "text-white"}`}><span><span className="mr-3 font-mono text-[9px] text-white/30">0{index + 1}</span>{translatedLabel(label, t)}</span><ArrowUpRight className="size-4 text-white/30" /></Link>)}
        </nav>
        <div className="mt-5 flex flex-wrap gap-2">{isAuthenticated ? <Link onClick={() => setOpen(false)} href="/orders" className="border border-[#8bd32c] px-3 py-3 font-mono text-[10px] uppercase tracking-[.15em] text-[#8bd32c]">{t("myOrders")} →</Link> : <button onClick={() => { setOpen(false); startLogin(); }} className="border border-[#8bd32c] px-3 py-3 font-mono text-[10px] uppercase tracking-[.15em] text-[#8bd32c]">{t("signIn")} →</button>}<Link onClick={() => setOpen(false)} href="/contact" className="bg-[#8bd32c] px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[.15em] text-black">{t("contact")}</Link></div>
      </div>}
    </header>
    <div className="h-1 w-full bg-[#8bd32c]" />
    <main>{children}</main>
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-12 md:grid-cols-[1.2fr_2fr] md:px-8">
        <div><div className="flex items-center gap-3"><GwaveLogo className="size-10 md:size-12" /><p className="font-display text-4xl font-black tracking-[-0.1em] md:text-5xl">GWAVE</p></div><p className="mt-4 max-w-sm text-sm leading-6 text-white/55">{t("footerDescription")}</p></div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 sm:grid-cols-4">{[["Privacy", "/privacy"], ["Terms", "/terms"], ["Refunds", "/refunds"], ["Shipping", "/shipping"], ["Contact", "/contact"], ["Order desk", "/orders"], ["Staff", "/admin"], ["Help", "/help"], ["Roadmap", "/roadmap"], ["© 2026 Gwave", "/about"]].map(([label, href]) => <Link key={label} href={href} className="border-b border-white/10 py-3 transition-colors hover:text-[#8bd32c]">{translatedLabel(label, t)}</Link>)}</div>
      </div>
    </footer>
  </div>;
}
