import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, translations } from "./translations";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LanguageCtx | undefined>(undefined);

const getInitial = (): Lang => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("lang") as Lang | null;
  if (stored && translations[stored]) return stored;
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav === "fr" || nav === "es") return nav;
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitial);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[lang] ?? translations.en;
      let str = dict[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [lang],
  );

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
};

export const useT = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used inside LanguageProvider");
  return ctx;
};
