import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "my";

export const LANGUAGE_KEY = "gwave-language-v1";

export function readStoredLanguage(storage: Pick<Storage, "getItem"> | undefined): Language {
  return storage?.getItem(LANGUAGE_KEY) === "my" ? "my" : "en";
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
};

export const translations = {
  en: {
    language: "Language",
    english: "English",
    myanmar: "မြန်မာ",
    help: "Help & User Guide",
    roadmap: "Roadmap & Trust",
    menu: "Menu",
    signIn: "Sign in",
    signOut: "Sign out",
    contact: "Contact",
    myOrders: "My orders",
    returnToGwave: "Return to Gwave",
    accessControl: "Access control / 001",
    ageRequired: "21+ Required",
    ageIntro: "You must actively confirm that you are of legal age before entering Gwave. Restricted products stay behind additional signed-in verification.",
    confirmAge: "I confirm that I am 21 years of age or older and will comply with all laws that apply to my location.",
    enterGwave: "Enter Gwave",
    verifying: "Verifying",
    ageNotice: "This gate is an access control, not a declaration that any product is lawful in every location.",
    helpIntro: "Practical guidance for access, shopping, knowledge records, orders, payments, and support.",
    searchHelp: "Search help topics",
    noHelpResults: "No help topics match your search.",
    openHelp: "Open help guide",
    operations: "Operations",
    coaVerification: "COA verification",
    dashboardMenu: "Navigation",
    signInContinue: "Sign in to continue",
    dashboardAuthRequired: "Access to this dashboard requires authentication. Continue to launch the login flow.",
    footerDescription: "A compliance-aware catalogue, knowledge and merchandise platform. Access, availability and fulfilment depend on applicable rules.",
  },
  my: {
    language: "ဘာသာစကား",
    english: "English",
    myanmar: "မြန်မာ",
    help: "အကူအညီနှင့် အသုံးပြုနည်း",
    roadmap: "Roadmap နှင့် ယုံကြည်မှု",
    menu: "မီနူး",
    signIn: "အကောင့်ဝင်ရန်",
    signOut: "အကောင့်ထွက်ရန်",
    contact: "ဆက်သွယ်ရန်",
    myOrders: "ကျွန်ုပ်၏အော်ဒါများ",
    returnToGwave: "Gwave သို့ ပြန်သွားရန်",
    accessControl: "ဝင်ရောက်ခွင့်ထိန်းချုပ်မှု / ၀၀၁",
    ageRequired: "၂၁ နှစ်ပြည့်ရန် လိုအပ်သည်",
    ageIntro: "Gwave သို့ ဝင်ရောက်ရန် မိမိသည် တရားဝင်အသက်ပြည့်ကြောင်း အတည်ပြုရပါမည်။ Restricted product များသည် အကောင့်ဝင်ပြီး ထပ်ဆင့်စစ်ဆေးမှုအောက်တွင် ရှိပါသည်။",
    confirmAge: "ကျွန်ုပ်သည် အသက် ၂၁ နှစ် သို့မဟုတ် ထို့ထက်ကြီးပြီး မိမိတည်နေရာနှင့် သက်ဆိုင်သော ဥပဒေများကို လိုက်နာမည်ဟု အတည်ပြုပါသည်။",
    enterGwave: "Gwave သို့ ဝင်ရန်",
    verifying: "စစ်ဆေးနေသည်",
    ageNotice: "ဤ gate သည် ဝင်ရောက်ခွင့်ထိန်းချုပ်မှုသာဖြစ်ပြီး မည်သည့်နေရာတွင်မဆို ပစ္စည်းတိုင်း တရားဝင်သည်ဟု ကြေညာခြင်းမဟုတ်ပါ။",
    helpIntro: "ဝင်ရောက်ခွင့်၊ ဈေးဝယ်ခြင်း၊ knowledge records၊ အော်ဒါ၊ ငွေပေးချေမှုနှင့် အကူအညီအတွက် လက်တွေ့အသုံးပြုနည်းများ။",
    searchHelp: "အကူအညီအကြောင်းအရာ ရှာရန်",
    noHelpResults: "ရှာဖွေမှုနှင့် ကိုက်ညီသော အကူအညီအကြောင်းအရာ မတွေ့ပါ။",
    openHelp: "အသုံးပြုနည်းလမ်းညွှန် ဖွင့်ရန်",
    operations: "လုပ်ငန်းစီမံမှု",
    coaVerification: "COA စစ်ဆေးမှု",
    dashboardMenu: "လမ်းညွှန်မီနူး",
    signInContinue: "ဆက်လက်ရန် အကောင့်ဝင်ပါ",
    dashboardAuthRequired: "ဤ dashboard ကို အသုံးပြုရန် အကောင့်ဝင်ရန် လိုအပ်ပါသည်။ Login flow ကို ဆက်လက်ဖွင့်ပါ။",
    footerDescription: "Compliance ကို အခြေခံထားသော catalogue၊ knowledge နှင့် merchandise platform ဖြစ်ပါသည်။ ဝင်ရောက်ခွင့်၊ ရရှိနိုင်မှုနှင့် ပို့ဆောင်မှုများသည် သက်ဆိုင်ရာ စည်းမျဉ်းများအပေါ် မူတည်ပါသည်။",
  },
} as const;

export function getLanguageCopy(language: Language, key: keyof typeof translations.en): string {
  return translations[language][key] ?? translations.en[key];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return readStoredLanguage(window.localStorage);
  });

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language === "my" ? "my" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    toggleLanguage: () => setLanguageState(current => current === "en" ? "my" : "en"),
    t: key => getLanguageCopy(language, key),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
