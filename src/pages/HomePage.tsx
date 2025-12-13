// src/pages/HomePage.tsx
import { Difficulty, Language } from "../types";
import "./HomePage.css";

type Props = {
  lang: Language;
  difficulty: Difficulty;
  onStartQuiz: () => void;
  onGoPickDifficulty: () => void;
};

export default function HomePage({
  lang,
  difficulty,
  onStartQuiz,
  onGoPickDifficulty,
}: Props) {
  const titleLines =
    lang === "ko"
      ? ["전 세계에 있는 도시를", "맞춰 보는 두뇌 상식 게임"]
      : ["A brain quiz game", "to guess cities worldwide"];

  return (
    <div className="home">
      <div className="home__intro">
        <div className="home__line">{titleLines[0]}</div>
        <div className="home__line">{titleLines[1]}</div>
      </div>

      <button type="button" className="home__primary" onClick={onStartQuiz}>
        {lang === "ko" ? "퀴즈 시작하기" : "Start Quiz"}
      </button>

      <button
        type="button"
        className="home__secondary"
        onClick={onGoPickDifficulty}
      >
        {lang === "ko" ? "난이도 선택 후 시작" : "Select Difficulty"}
      </button>

      {/* 난이도 값은 내부 상태로 유지 중 */}
      <span className="srOnly">현재난이도:{difficulty}</span>
    </div>
  );
}
