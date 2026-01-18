// src/pages/QuizPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Difficulty, Language, Question } from "../types";
import { useStats } from "../hooks/useStats";
import type { Difficulty as StatsDifficulty } from "../utils/stats";
import { getXP, addXP, getXPRequiredForLevel } from "../utils/storage";
import { MapModal } from "../components/MapModal";
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
  
  // XP/레벨 상태
  const [xpData, setXpData] = useState(getXP());
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // 지도 모달 상태
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  
  // 힌트 상태
  const [showHint, setShowHint] = useState(false);

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
      setShowHint(false); // 문제 변경 시 힌트 초기화
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
  
  // 정답 도시 정보 (cityData가 있으면 사용)
  const cityData = currentQ.cityData;

  // window.onRewarded 콜백 등록 (보상형 광고 성공 시 호출)
  // 컴포넌트 마운트 시 한 번만 등록하고, 내부에서 최신 상태를 참조하도록 함
  useEffect(() => {
    console.log('Registering window.onRewarded callback');
    
    // @ts-ignore - Android WebView에서 제공하는 콜백
    const onRewardedCallback = (type: 'hint' | 'map') => {
      console.log('window.onRewarded called with type:', type);
      
      if (type === 'hint') {
        console.log('Setting showHint to true');
        setShowHint(true);
      } else if (type === 'map') {
        console.log('Setting isMapModalOpen to true');
        setIsMapModalOpen(true);
      }
    };
    
    // @ts-ignore
    window.onRewarded = onRewardedCallback;

    // 클린업
    return () => {
      // @ts-ignore
      if (window.onRewarded === onRewardedCallback) {
        console.log('Cleaning up window.onRewarded callback');
        // @ts-ignore
        delete window.onRewarded;
      }
    };
  }, []); // 빈 dependency 배열 - 한 번만 등록
  const cityName = cityData 
    ? (lang === "ko" ? cityData.nameKo : cityData.nameEn)
    : null;
  const countryName = cityData
    ? (lang === "ko" ? (cityData.countryKo || cityData.country) : cityData.country)
    : null;
  const cityBlurb = cityData
    ? (lang === "ko" ? cityData.blurbKo : cityData.blurbEn)
    : null;
  
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

  // XP 진행률 계산
  const currentLevelXP = getXPRequiredForLevel(xpData.level);
  const nextLevelXP = getXPRequiredForLevel(xpData.level + 1);
  const xpForCurrentLevel = xpData.xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = xpNeededForNextLevel > 0 
    ? Math.min(100, (xpForCurrentLevel / xpNeededForNextLevel) * 100)
    : 100;

  const pick = (selectedOptionId: string) => {
    if (state.kind !== "idle" || isAnswered) return;

    // id 기반 채점
    const isCorrect = selectedOptionId === currentQ.correctOptionId;
    
    setIsAnswered(true);
    
    // XP 추가
    const newXPData = addXP(isCorrect);
    setXpData(newXPData);
    
    // 레벨업 체크
    if (newXPData.leveledUp) {
      setShowLevelUp(true);
      // 레벨업 토스트 2초 후 자동 닫기
      setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
    }
    
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

  // 보상형 광고 호출
  const handleRequestRewardedAd = (type: 'hint' | 'map') => {
    console.log('handleRequestRewardedAd called with type:', type);
    
    // @ts-ignore - Android WebView에서 제공하는 인터페이스
    const androidInterface = (window as any).Android;
    
    if (androidInterface && typeof androidInterface.showRewardedAd === 'function') {
      console.log('Calling Android.showRewardedAd:', type);
      try {
        androidInterface.showRewardedAd(type);
      } catch (e) {
        console.error('Error calling Android.showRewardedAd:', e);
        // 에러 발생 시에도 보상 제공 (사용자 경험 개선)
        if (type === 'hint') {
          setShowHint(true);
        } else if (type === 'map' && cityData) {
          setIsMapModalOpen(true);
        }
      }
    } else {
      // Android WebView가 아닌 환경(브라우저)이거나 인터페이스가 로드되지 않은 경우
      console.warn('Android interface not available, granting reward immediately (dev/fallback mode)');
      if (type === 'hint') {
        setShowHint(true);
      } else if (type === 'map' && cityData) {
        setIsMapModalOpen(true);
      }
    }
  };

  // 정답 나라의 첫 글자 힌트 생성
  const hintText = useMemo(() => {
    if (!cityData || !countryName) return null;
    const firstLetter = countryName.charAt(0).toUpperCase();
    return lang === 'ko' 
      ? `정답 나라의 첫 글자: ${firstLetter}`
      : `First letter of the country: ${firstLetter}`;
  }, [cityData, countryName, lang]);

  return (
    <div className="quiz">
      {/* XP/레벨 바 */}
      <div className="xpBar">
        <div className="xpBar__info">
          <span className="xpBar__level">{lang === "ko" ? "레벨" : "Level"} {xpData.level}</span>
          <span className="xpBar__xp">{xpData.xp} XP</span>
        </div>
        <div className="xpBar__progress">
          <div 
            className="xpBar__progressFill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 레벨업 토스트 */}
      {showLevelUp && (
        <div className="levelUpToast">
          <div className="levelUpToast__content">
            <span className="levelUpToast__icon">🎉</span>
            <span className="levelUpToast__text">
              {lang === "ko" ? `레벨 ${xpData.level} 달성!` : `Level ${xpData.level} Achieved!`}
            </span>
          </div>
        </div>
      )}

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

      {/* 힌트 버튼 (문제를 풀기 전에만 표시) */}
      {state.kind === "idle" && cityData && (
        <div className="quiz__hintArea">
          <button
            type="button"
            className="quiz__hintButton"
            onClick={() => handleRequestRewardedAd('hint')}
          >
            {lang === "ko" ? "힌트 보기 (광고 1회)" : "View Hint (1 ad)"}
          </button>
          {showHint && hintText && (
            <div className="quiz__hintText">
              {hintText}
            </div>
          )}
        </div>
      )}

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

      {/* 도시 카드 영역 (정답/오답 결과 화면에 표시) */}
      {showExplain && (state.kind === "correct" || state.kind === "wrong") && cityData && (
        <div className="quiz__cityCard">
          <div className="cityCard">
            <div className="cityCard__header">
              <div className="cityCard__name">{cityName}</div>
              {countryName && (
                <div className="cityCard__country">{countryName}</div>
              )}
            </div>
            {cityBlurb && (
              <div className="cityCard__blurb">{cityBlurb}</div>
            )}
            <div className="cityCard__actions">
              <button
                type="button"
                className="cityCard__mapButton"
                onClick={() => handleRequestRewardedAd('map')}
              >
                {lang === "ko" ? "지도 보기 (광고 1회)" : "View Map (1 ad)"}
              </button>
            </div>
            <div className="cityCard__adNote">
              {lang === "ko" ? "광고 없이도 계속 플레이 가능" : "Continue playing without ads"}
            </div>
          </div>
        </div>
      )}

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

      {/* 지도 모달 */}
      {cityData && (
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          cityData={cityData}
          lang={lang}
        />
      )}
    </div>
  );
}
