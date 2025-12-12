// src/components/TopBar.tsx
import { Language } from "../types";
import "./TopBar.css";

type Props = {
  lang: Language;
  onChangeLang: (lang: Language) => void;
};

export default function TopBar({ lang, onChangeLang }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__title">도시 퀴즈</div>

      <div className="topbar__lang">
        <button
          type="button"
          className={`topbar__langBtn ${lang === "ko" ? "isActive" : ""}`}
          onClick={() => onChangeLang("ko")}
        >
          한국어
        </button>
        <div className="topbar__divider" />
        <button
          type="button"
          className={`topbar__langLink ${lang === "en" ? "isActive" : ""}`}
          onClick={() => onChangeLang("en")}
        >
          English
        </button>
      </div>
    </header>
  );
}
