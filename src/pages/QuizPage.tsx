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

  const pick = (choiceIndex: number) => {
    if (state.kind !== "idle") return;

    if (choiceIndex === q.correctIndex) {
      setState({ kind: "correct", pickedIndex: choiceIndex });
      window.setTimeout(() => {
        setIdx((v) => v + 1);
      }, 700);
    } else {
      setState({ kind: "wrong", pickedIndex: choiceIndex });
    }
  };

  const onNext = () => {
    setIdx((v) => v + 1);
  };

  const explainText = lang === "ko" ? q.explanationKo : q.explanationEn;

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

      {/* 오답일 때만 아래 2버튼 표시 */}
      {state.kind === "wrong" ? (
        <div className="quiz__actions">
          <button type="button" className="act actNext" onClick={onNext}>
            {lang === "ko" ? (
              <>
                다음
                <br />
                문제
              </>
            ) : (
              <>
                Next
                <br />
                Question
              </>
            )}
          </button>

          <button
            type="button"
            className="act actExplain"
            onClick={() => setShowExplain(true)}
          >
            {lang === "ko" ? (
              <>
                상세 설명
                <br />
                보기
              </>
            ) : (
              <>
                Show
                <br />
                Explanation
              </>
            )}
          </button>
        </div>
      ) : null}

      {/* 상세 설명 모달 */}
      {showExplain ? (
        <div className="modalBack" onClick={() => setShowExplain(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__title">{lang === "ko" ? "상세 설명" : "Explanation"}</div>
            <div className="modal__body">{explainText}</div>
            <button
              type="button"
              className="modal__close"
              onClick={() => setShowExplain(false)}
            >
              {lang === "ko" ? "닫기" : "Close"}
            </button>
          </div>
        </div>
      ) : null}

      {/* 쿠팡 배너 */}
      <div style={{ padding: '0 18px', marginTop: '20px' }}>
        <div style={{ 
          background: '#f5f5f5', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '14px', 
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          {lang === "ko" ? "도시를 더 많이 알고 싶다면?" : "Want to know more cities?"}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          textAlign: 'center' 
        }}>
          {lang === "ko" 
            ? "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
            : "This posting is part of Coupang Partners activity, and a certain amount of commission is provided accordingly."}
        </div>
      </div>
    </div>
  );
}
