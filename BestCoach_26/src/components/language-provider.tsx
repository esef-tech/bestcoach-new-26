"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Lang, type Dict } from "@/lib/dictionaries";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const LanguageContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // load saved language on mount (sync with localStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bc-lang") as Lang | null;
      if (saved && translations[saved] && saved !== lang) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(saved);
      }
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") localStorage.setItem("bc-lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}