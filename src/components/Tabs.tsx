// src/components/Tabs.tsx
import { Page } from "../types";
import "./Tabs.css";

type Props = {
  page: Page;
  onChangePage: (page: Page) => void;
};

export default function Tabs({ page, onChangePage }: Props) {
  return (
    <nav className="tabs">
      <button
        type="button"
        className={`tabs__item ${page === "home" ? "isActive" : ""}`}
        onClick={() => onChangePage("home")}
      >
        홈
      </button>
      <button
        type="button"
        className={`tabs__item ${page === "quiz" ? "isActive" : ""}`}
        onClick={() => onChangePage("quiz")}
      >
        퀴즈
      </button>
      <button
        type="button"
        className={`tabs__item ${page === "stats" ? "isActive" : ""}`}
        onClick={() => onChangePage("stats")}
      >
        통계
      </button>
    </nav>
  );
}
