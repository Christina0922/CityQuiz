// src/pages/QuizPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Difficulty, Language, Question } from "../types";
import { useStats } from "../hooks/useStats";
import type { Difficulty as StatsDifficulty } from "../utils/stats";
import "./QuizPage.css";

type Props = {
  lang: Language;
  difficulty: Difficulty;
  onChangeDifficulty: (d: Difficulty) => void;
  questionsByDifficulty: Record<Difficulty, Question[]>;
};

type AnswerState =
  | { kind: "idle" }
  | { kind: "correct"; pickedOptionId: string }
  | { kind: "wrong"; pickedOptionId: string };

// Fisher-Yates 셔플 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 난이도 매핑: QuizPage의 Difficulty -> Stats의 Difficulty
function mapDifficultyToStats(difficulty: Difficulty): StatsDifficulty {
  if (difficulty === "high") return "hard";
  if (difficulty === "mid") return "medium";
  return "easy";
}

export default function QuizPage({
  lang,
  difficulty,
  onChangeDifficulty,
  questionsByDifficulty,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<AnswerState>({ kind: "idle" });
  const [showExplain, setShowExplain] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const { record } = useStats();

  // 현재 난이도에 해당하는 문제 풀
  const currentQuestions = useMemo(() => {
    return questionsByDifficulty[difficulty];
  }, [questionsByDifficulty, difficulty]);

  // 현재 문제
  const currentQ = useMemo(() => {
    if (currentQuestions.length === 0) return null;
    const baseQ = currentQuestions[idx % currentQuestions.length];
    
    // 안전장치 검사
    if (baseQ.options.length !== 3 || baseQ.optionsEn.length !== 3) {
      return null;
    }
    
    const optionIds = baseQ.options.map(opt => opt.id);
    if (new Set(optionIds).size !== 3) {
      return null; // ID 중복
    }
    
    if (baseQ.options.filter(opt => opt.id === baseQ.correctOptionId).length !== 1) {
      return null; // correctOptionId가 options에 정확히 1개 존재하지 않음
    }
    
    return baseQ;
  }, [currentQuestions, idx]);

  // 난이도 변경 시 문제 인덱스 리셋
  useEffect(() => {
    setIdx(0);
    setState({ kind: "idle" });
    setShowExplain(false);
    setIsAnswered(false);
  }, [difficulty]);

  // 언어 변경 시 문제 인덱스 리셋 (같은 문제라도 언어가 바뀌면 다시 표시)
  useEffect(() => {
    setState({ kind: "idle" });
    setShowExplain(false);
    setIsAnswered(false);
  }, [lang]);

  useEffect(() => {
    if (currentQ) {
      setState({ kind: "idle" });
      setShowExplain(false);
      setIsAnswered(false);
    } else {
      // 안전장치 실패 시 다음 문제로
      setIdx((v) => v + 1);
    }
  }, [currentQ?.id]);

  // 안전장치 실패로 문제가 없으면 다음 문제로
  if (!currentQ) {
    return (
      <div className="quiz">
        <div style={{ padding: "20px", textAlign: "center" }}>
          {lang === "ko" ? "문제를 불러오는 중..." : "Loading questions..."}
        </div>
      </div>
    );
  }

  const prompt = lang === "ko" ? currentQ.promptKo : currentQ.promptEn;
  const explainText = lang === "ko" ? currentQ.explanationKo : currentQ.explanationEn;
  
  // 문제 출제 시점에 한 번만 셔플된 옵션 생성 (문제가 바뀔 때만 셔플, 답 체크 후에는 순서 절대 유지)
  // 언어가 변경되면 해당 언어의 옵션으로 재셔플
  // currentQ.id와 lang을 조합한 키를 사용하여 문제별, 언어별로 독립적인 셔플 보장
  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];
    const baseOptions = lang === "ko" ? currentQ.options : currentQ.optionsEn;
    // 안전장치: baseOptions가 없거나 비어있으면 빈 배열 반환
    if (!baseOptions || baseOptions.length === 0) {
      console.warn(`No options found for question ${currentQ.id} in language ${lang}`);
      return [];
    }
    return shuffleArray([...baseOptions]); // 새 배열로 복사하여 셔플
  }, [currentQ?.id, lang, currentQ?.options, currentQ?.optionsEn]); // currentQ의 options도 dependency에 포함
  
  // 셔플된 옵션을 그대로 사용 (이미 올바른 언어의 옵션)
  const displayOptions = shuffledOptions;

  const pick = (selectedOptionId: string) => {
    if (state.kind !== "idle" || isAnswered) return;

    // id 기반 채점
    const isCorrect = selectedOptionId === currentQ.correctOptionId;
    
    setIsAnswered(true);
    
    if (isCorrect) {
      setState({ kind: "correct", pickedOptionId: selectedOptionId });
      setShowExplain(true);
      window.setTimeout(() => {
        setIdx((v) => v + 1);
      }, 700);
    } else {
      setState({ kind: "wrong", pickedOptionId: selectedOptionId });
      setShowExplain(true);
    }
    
    // 통계 기록 (1번만)
    const statsDifficulty = mapDifficultyToStats(difficulty);
    record(statsDifficulty, isCorrect);
  };

  const onNext = () => {
    setIdx((v) => v + 1);
  };

  return (
    <div className="quiz">
      {/* 난이도 바 */}
      <div className="diffBar">
        <div className="diffBar__label">{lang === "ko" ? "난이도" : "Difficulty"}</div>
        <div className="diffBar__circles">
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
      </div>

      <div className="quiz__prompt">{prompt}</div>

      <div className="quiz__choices">
        {displayOptions.map((option) => {
          const isPicked =
            (state.kind === "correct" || state.kind === "wrong") &&
            state.pickedOptionId === option.id;

          const isCorrectPicked = state.kind === "correct" && isPicked;
          const isWrongPicked = state.kind === "wrong" && isPicked;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "choice",
                isCorrectPicked ? "isCorrect" : "",
                isWrongPicked ? "isWrong" : "",
              ].join(" ")}
              onClick={() => pick(option.id)}
              disabled={state.kind !== "idle"}
            >
              <span className="choice__text">{option.label}</span>

              {isCorrectPicked ? <span className="choice__markO">O</span> : null}
              {isWrongPicked ? <span className="choice__markX">X</span> : null}
            </button>
          );
        })}
      </div>

      {/* Next Question 버튼 영역 (placeholder로 공간 확보) */}
      <div className={`quiz__actions ${showExplain ? 'with-explanation' : ''} ${state.kind === "wrong" ? 'visible' : 'placeholder'}`}>
        {state.kind === "wrong" ? (
          <button type="button" className="act actNext" onClick={onNext}>
            {lang === "ko" ? "다음 문제" : "Next Question"}
          </button>
        ) : (
          <div className="quiz__actions-placeholder"></div>
        )}
      </div>

      {/* 상세 설명 영역 (placeholder로 공간 확보) */}
      <div className={`quiz__explanation-wrapper ${showExplain && (state.kind === "correct" || state.kind === "wrong") ? 'visible' : 'placeholder'}`}>
        {showExplain && (state.kind === "correct" || state.kind === "wrong") ? (
          <div className="quiz__explanation">
            <div className="quiz__explanation-title">
              {lang === "ko" ? "상세 설명" : "Explanation"}
            </div>
            <div className="quiz__explanation-text">{explainText}</div>
          </div>
        ) : (
          <div className="quiz__explanation-placeholder"></div>
        )}
      </div>
    </div>
  );
}
