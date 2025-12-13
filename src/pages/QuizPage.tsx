// src/pages/QuizPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Difficulty, Language, Question } from "../types";
import "./QuizPage.css";

type Props = {
  lang: Language;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  questionsByDifficulty: Record<Difficulty, Question[]>;
};

type AnswerState =
  | { kind: "idle" }
  | { kind: "correct"; pickedIndex: number }
  | { kind: "wrong"; pickedIndex: number };

export default function QuizPage({
  lang,
  difficulty,
  onChangeDifficulty,
  questionsByDifficulty,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<AnswerState>({ kind: "idle" });
  const [showExplain, setShowExplain] = useState(false);

  // 현재 난이도에 해당하는 문제 풀
  const currentQuestions = useMemo(() => {
    return questionsByDifficulty[difficulty];
  }, [questionsByDifficulty, difficulty]);

  // 현재 문제
  const q = useMemo(() => {
    if (currentQuestions.length === 0) return null;
    return currentQuestions[idx % currentQuestions.length];
  }, [currentQuestions, idx]);

  // 난이도 변경 시 문제 인덱스 리셋
  useEffect(() => {
    setIdx(0);
    setState({ kind: "idle" });
    setShowExplain(false);
  }, [difficulty]);

  useEffect(() => {
    if (q) {
      setState({ kind: "idle" });
      setShowExplain(false);
    }
  }, [q?.id]);

  if (!q) {
    return (
      <div className="quiz">
        <div style={{ padding: "20px", textAlign: "center" }}>
          {lang === "ko" ? "문제를 불러오는 중..." : "Loading questions..."}
        </div>
      </div>
    );
  }

  const prompt = lang === "ko" ? q.promptKo : q.promptEn;
  const choices = lang === "ko" ? q.choicesKo : q.choicesEn;
  const explainText = lang === "ko" ? q.explanationKo : q.explanationEn;

  const pick = (choiceIndex: number) => {
    if (state.kind !== "idle") return;

    if (choiceIndex === q.correctIndex) {
      setState({ kind: "correct", pickedIndex: choiceIndex });
      setShowExplain(true);
      window.setTimeout(() => {
        setIdx((v) => v + 1);
      }, 700);
    } else {
      setState({ kind: "wrong", pickedIndex: choiceIndex });
      setShowExplain(true);
    }
  };

  const onNext = () => {
    setIdx((v) => v + 1);
  };

  return (
    <div className="quiz">
      {/* 난이도 바 */}
      <div className="diffBar">
        <div className="diffBar__label">{lang === "ko" ? "난이도" : "Difficulty"}</div>

        <button
          type="button"
          className="diffBar__circleBtn"
          onClick={() => onChangeDifficulty("high")}
          aria-label={lang === "ko" ? "난이도 상" : "Hard"}
        >
          <span
            className={`diffBar__circle ${
              difficulty === "high" ? "diffBar__circle--high filled" : "diffBar__circle--high"
            }`}
          />
        </button>

        <button
          type="button"
          className="diffBar__circleBtn"
          onClick={() => onChangeDifficulty("mid")}
          aria-label={lang === "ko" ? "난이도 중" : "Medium"}
        >
          <span
            className={`diffBar__circle ${
              difficulty === "mid" ? "diffBar__circle--mid filled" : "diffBar__circle--mid"
            }`}
          />
        </button>

        <button
          type="button"
          className="diffBar__circleBtn"
          onClick={() => onChangeDifficulty("low")}
          aria-label={lang === "ko" ? "난이도 하" : "Easy"}
        >
          <span
            className={`diffBar__circle ${
              difficulty === "low" ? "diffBar__circle--low filled" : "diffBar__circle--low"
            }`}
          />
        </button>
      </div>

      <div className="quiz__prompt">{prompt}</div>

      <div className="quiz__choices">
        {choices.map((text, i) => {
          const isPicked =
            (state.kind === "correct" || state.kind === "wrong") &&
            state.pickedIndex === i;

          const isCorrectPicked = state.kind === "correct" && isPicked;
          const isWrongPicked = state.kind === "wrong" && isPicked;

          return (
            <button
              key={`${q.id}-${i}`}
              type="button"
              className={[
                "choice",
                isCorrectPicked ? "isCorrect" : "",
                isWrongPicked ? "isWrong" : "",
              ].join(" ")}
              onClick={() => pick(i)}
            >
              <span className="choice__text">{text}</span>

              {isCorrectPicked ? <span className="choice__markO">O</span> : null}
              {isWrongPicked ? <span className="choice__markX">X</span> : null}
            </button>
          );
        })}
      </div>

      {/* 오답일 때만 다음 문제 버튼 표시 */}
      {state.kind === "wrong" ? (
        <div className={`quiz__actions ${showExplain ? 'with-explanation' : ''}`}>
          <button type="button" className="act actNext" onClick={onNext}>
            {lang === "ko" ? "다음 문제" : "Next Question"}
          </button>
        </div>
      ) : null}

      {/* 상세 설명 영역 (인라인) */}
      {showExplain && (state.kind === "correct" || state.kind === "wrong") ? (
        <div className="quiz__explanation">
          <div className="quiz__explanation-title">
            {lang === "ko" ? "상세 설명" : "Explanation"}
          </div>
          <div className="quiz__explanation-text">{explainText}</div>
        </div>
      ) : null}
    </div>
  );
}
