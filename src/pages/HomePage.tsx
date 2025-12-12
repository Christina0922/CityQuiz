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
        퀴즈 시작하기
      </button>

      <button
        type="button"
        className="home__secondary"
        onClick={onGoPickDifficulty}
      >
        난이도 선택 후 시작
      </button>

      {/* 쿠팡 광고 영역 */}
      <div className="home__coupang">
        <button type="button" className="home__coupangBtn">
          도시를 더 많이 알고 싶다면?
        </button>
        <div className="home__coupangText">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로,
          이에 따른 일정액의 수수료를 제공받습니다.
        </div>
      </div>

      {/* 난이도 값은 내부 상태로 유지 중 */}
      <span className="srOnly">현재난이도:{difficulty}</span>
    </div>
  );
}
