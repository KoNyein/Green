import { Check, FileSearch, ShieldCheck, Truck } from "lucide-react";

const ORDER_STEPS = [
  { key: "payment_pending", label: "Payment", my: "ငွေပေးချေမှု", icon: FileSearch },
  { key: "payment_under_review", label: "Review", my: "စစ်ဆေးမှု", icon: ShieldCheck },
  { key: "approved_for_fulfilment", label: "Approved", my: "အတည်ပြု", icon: Check },
  { key: "packing", label: "Packing", my: "ထုပ်ပိုးမှု", icon: PackageIcon },
  { key: "shipped", label: "Shipped", my: "ပို့ဆောင်ပြီး", icon: Truck },
  { key: "completed", label: "Complete", my: "ပြီးဆုံး", icon: Check },
] as const;

function PackageIcon({ className }: { className?: string }) {
  return <span className={className} aria-hidden="true">□</span>;
}

export function OrderTimeline({ status, copy }: { status: string; copy: (en: string, my: string) => string }) {
  const current = ORDER_STEPS.findIndex(step => step.key === status);
  return <div className="mt-5 grid grid-cols-3 gap-px bg-white/15 sm:grid-cols-6">{ORDER_STEPS.map((step, index) => { const Icon = step.icon; const active = index <= current; return <div key={step.key} className={`min-w-0 bg-black px-2 py-3 text-center ${active ? "text-[#8bd32c]" : "text-white/30"}`}><Icon className="mx-auto size-4"/><p className="mt-2 truncate font-mono text-[9px] uppercase tracking-[.08em]">{copy(step.label, step.my)}</p></div>; })}</div>;
}

type StrainInfographicProps = {
  item: { name: string; classification: string; verifiedFacts: string; supplierDescription: string; educationalNote: string; legalNotice: string; profileReviewedAt: Date | number | null; cannabinoidSource: string | null; effectSource: string | null; thcMinPercent: string | number | null; thcMaxPercent: string | number | null; cbdMinPercent: string | number | null; cbdMaxPercent: string | number | null; effectTags: string[] | null };
  coa: { labName: string; reportNumber: string; batchLot: string | null; testedAt: Date | number | null; reviewedAt: Date | number | null; cannabinoidResults: Record<string, string>; terpeneSummary: Record<string, string>; sourceReference: string } | null;
  copy: (en: string, my: string) => string;
};

export function StrainInfographic({ item, coa, copy }: StrainInfographicProps) {
  const profileReady = Boolean(item.profileReviewedAt && (item.cannabinoidSource || item.effectSource));
  const thc = profileReady && item.cannabinoidSource && item.thcMinPercent != null && item.thcMaxPercent != null ? `${item.thcMinPercent}–${item.thcMaxPercent}%` : "Not sourced";
  const cbd = profileReady && item.cannabinoidSource && item.cbdMinPercent != null && item.cbdMaxPercent != null ? `${item.cbdMinPercent}–${item.cbdMaxPercent}%` : "Not sourced";
  const effects = item.effectSource && item.effectTags?.length ? item.effectTags.join(" / ") : "Not sourced";
  const facts = [
    [copy("THC range", "THC အတိုင်းအတာ"), thc, copy("Profile status", "Profile အခြေအနေ")],
    [copy("CBD range", "CBD အတိုင်းအတာ"), cbd, copy("Profile status", "Profile အခြေအနေ")],
    [copy("Effect profile", "အာနိသင် profile"), effects, copy("Profile status", "Profile အခြေအနေ")],
  ];
  return <div className="mt-10 space-y-8">
    <section className="border border-white/20 bg-white/[.03] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#8bd32c]">{copy("Strain profile / infographic", "Strain profile / infographic")}</p><h2 className="mt-2 font-display text-4xl font-bold uppercase">{copy("Read the profile", "Profile ကိုဖတ်ပါ")}</h2></div><span className="font-mono text-[10px] uppercase tracking-[.14em] text-white/45">{profileReady ? copy("Source reviewed", "Source စစ်ဆေးပြီး") : copy("Source pending", "Source စောင့်နေသည်")}</span></div>
      <div className="mt-7 grid gap-px bg-white/15 sm:grid-cols-3">{facts.map(([label, value, source]) => <div key={label} className="bg-black p-5"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-white/45">{label}</p><p className="mt-4 break-words font-display text-3xl font-bold uppercase text-[#8bd32c]">{value}</p><p className="mt-4 font-mono text-[9px] uppercase tracking-[.1em] text-white/35">{source}</p></div>)}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="h-2 bg-white/10"><div className="h-full bg-[#8bd32c]" style={{ width: thc === "Not sourced" ? "8%" : "68%" }} /></div><div className="h-2 bg-white/10"><div className="h-full bg-[#8bd32c]" style={{ width: cbd === "Not sourced" ? "8%" : "42%" }} /></div><div className="h-2 bg-white/10"><div className="h-full bg-[#8bd32c]" style={{ width: effects === "Not sourced" ? "8%" : "78%" }} /></div></div>
      <p className="mt-5 text-sm leading-6 text-white/55">{copy("Bars are visual indicators of record availability, not laboratory measurements or medical guidance.", "Bar များသည် record ရရှိနိုင်မှုကို မြင်သာစေရန်သာ ဖြစ်ပြီး laboratory measurement သို့မဟုတ် ဆေးဘက်ဆိုင်ရာညွှန်ကြားချက် မဟုတ်ပါ။")}</p>
    </section>
    <div className="grid gap-px bg-white/20 md:grid-cols-2">{[[copy("Verified facts", "အတည်ပြုထားသောအချက်များ"), item.verifiedFacts], [copy("Supplier description", "ပေးသွင်းသူဖော်ပြချက်"), item.supplierDescription], [copy("Educational note", "ပညာပေးမှတ်ချက်"), item.educationalNote], [copy("Legal notice", "ဥပဒေဆိုင်ရာအသိပေးချက်"), item.legalNotice]].map(([title, body]) => <section key={title} className="bg-black p-5 sm:p-6"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8bd32c]">{title}</p><p className="mt-4 break-words text-sm leading-7 text-white/70">{body}</p></section>)}</div>
    {coa && <section className="border border-[#8bd32c] bg-[#8bd32c]/[.06] p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8bd32c]">Verified COA / Certificate of Analysis</p><p className="mt-2 font-display text-3xl font-bold uppercase">{coa.labName}</p></div><span className="border border-[#8bd32c] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#8bd32c]">Approved</span></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div><p className="font-mono text-[10px] uppercase text-white/45">Report / batch</p><p className="mt-2 break-words text-sm text-white/80">{coa.reportNumber}{coa.batchLot ? ` · ${coa.batchLot}` : ""}</p></div><div><p className="font-mono text-[10px] uppercase text-white/45">Test date</p><p className="mt-2 text-sm text-white/80">{coa.testedAt ? new Date(coa.testedAt).toLocaleDateString() : "Not supplied"}</p></div><div><p className="font-mono text-[10px] uppercase text-white/45">Verified on</p><p className="mt-2 text-sm text-white/80">{coa.reviewedAt ? new Date(coa.reviewedAt).toLocaleDateString() : "Approved record"}</p></div></div><div className="mt-6 grid gap-px bg-white/15 sm:grid-cols-2"><div className="bg-black/70 p-4"><p className="font-mono text-[10px] uppercase text-white/45">Cannabinoid results</p><div className="mt-3 grid gap-2">{Object.entries(coa.cannabinoidResults).map(([key, value]) => <p key={key} className="flex justify-between gap-4 font-mono text-xs uppercase"><span>{key}</span><span className="text-[#8bd32c]">{value}</span></p>)}</div></div><div className="bg-black/70 p-4"><p className="font-mono text-[10px] uppercase text-white/45">Terpene summary</p><div className="mt-3 grid gap-2">{Object.entries(coa.terpeneSummary).map(([key, value]) => <p key={key} className="break-words text-sm text-white/75"><span className="font-mono text-[10px] uppercase text-[#8bd32c]">{key}: </span>{value}</p>)}</div></div></div><p className="mt-5 text-sm leading-6 text-white/55">{copy("Public view shows verification status only. Detailed provenance remains available to authorized staff.", "Public view တွင် verification status ကိုသာ ပြသပါသည်။ အသေးစိတ် provenance ကို ခွင့်ပြုထားသော staff များအတွက်သာ သိမ်းဆည်းထားပါသည်။")}</p></section>}
  </div>;
}
