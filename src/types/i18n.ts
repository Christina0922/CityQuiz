export type Language = 'ko' | 'en';

export interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

