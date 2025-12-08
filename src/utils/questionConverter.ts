/**
 * 문제 변환 유틸리티
 * "다음 중 도시는?" 형태를 "다음 중 '~'에 해당하지 않는 것은?" 형태로 변환
 */

import { Question } from '../types/question';

interface QuestionAnalysis {
  correctOption: string;
  wrongOption: string;
  correctCountry?: string;
  wrongCountry?: string;
  correctContinent?: string;
  wrongContinent?: string;
  isCapital?: boolean;
}

/**
 * 설명 텍스트에서 국가/대륙 정보 추출
 */
function analyzeQuestion(question: Question): QuestionAnalysis {
  const explanation = question.explanation.ko;
  const correctOption = question.options[question.correctIndex];
  const wrongOption = question.options[1 - question.correctIndex];
  
  const analysis: QuestionAnalysis = {
    correctOption,
    wrongOption,
  };

  // 미국/캐나다/멕시코 등 특별 처리
  if (explanation.includes('미국')) {
    if (explanation.includes(correctOption) && explanation.includes('미국')) {
      analysis.correctCountry = '미국';
    }
    if (explanation.includes(wrongOption) && !explanation.includes('미국')) {
      analysis.wrongCountry = extractCountry(explanation);
    }
  }
  
  if (explanation.includes('캐나다')) {
    if (explanation.includes(correctOption) && explanation.includes('캐나다')) {
      analysis.correctCountry = '캐나다';
    }
    if (explanation.includes(wrongOption) && !explanation.includes('캐나다')) {
      analysis.wrongCountry = extractCountry(explanation);
    }
  }

  // 수도 여부 확인
  if (explanation.includes('수도')) {
    analysis.isCapital = true;
  }

  // 대륙 정보 (regionTag 활용)
  if (question.regionTag) {
    const continentMap: Record<string, string> = {
      'North America': '북아메리카',
      'South America': '남아메리카',
      'Europe': '유럽',
      'Asia': '아시아',
      'Africa': '아프리카',
      'Oceania': '오세아니아',
    };
    analysis.correctContinent = continentMap[question.regionTag] || question.regionTag;
  }

  return analysis;
}

function extractCountry(text: string): string {
  // 간단한 패턴 매칭으로 국가 추출
  if (text.includes('미국')) return '미국';
  if (text.includes('캐나다')) return '캐나다';
  if (text.includes('멕시코')) return '멕시코';
  if (text.includes('브라질')) return '브라질';
  if (text.includes('아르헨티나')) return '아르헨티나';
  if (text.includes('호주')) return '호주';
  if (text.includes('뉴질랜드')) return '뉴질랜드';
  if (text.includes('남아프리카')) return '남아프리카 공화국';
  if (text.includes('네덜란드')) return '네덜란드';
  if (text.includes('대한민국')) return '대한민국';
  if (text.includes('일본')) return '일본';
  if (text.includes('덴마크')) return '덴마크';
  if (text.includes('아일랜드')) return '아일랜드';
  if (text.includes('체코')) return '체코';
  if (text.includes('독일')) return '독일';
  if (text.includes('노르웨이')) return '노르웨이';
  if (text.includes('오스트리아')) return '오스트리아';
  if (text.includes('스페인')) return '스페인';
  if (text.includes('이탈리아')) return '이탈리아';
  if (text.includes('그리스')) return '그리스';
  if (text.includes('불가리아')) return '불가리아';
  
  return '알 수 없음';
}

/**
 * 문제 변환 - 단일 형식으로 통일
 * 모든 질문을 "다음 도시 중 어느 것이 {정답 국가}에 속하나요?" 형식으로 변환
 */
export function convertQuestion(question: Question): Question {
  const analysis = analyzeQuestion(question);
  
  let targetCountry: string;
  let newExplanation: string;

  // 정답 국가 추출
  if (analysis.correctCountry) {
    targetCountry = analysis.correctCountry;
  } else {
    // 설명에서 국가 추출 시도
    const country = extractCountry(question.explanation.ko);
    if (country !== '알 수 없음') {
      // 설명에서 정답 도시가 속한 국가 찾기
      if (question.explanation.ko.includes(analysis.correctOption)) {
        targetCountry = country;
      } else {
        // 오답 국가를 찾아서 반대로 사용
        targetCountry = extractCountry(question.explanation.ko.replace(analysis.wrongOption, ''));
      }
    } else {
      // 기본값: 미국
      targetCountry = '미국';
    }
  }

  // 새로운 질문 형식: "다음 도시 중 어느 것이 {정답 국가}에 속하나요?"
  const newQuestionText = `다음 도시 중 어느 것이 ${targetCountry}에 속하나요?`;

  // 설명: 정답 도시와 오답 도시의 국가를 모두 설명
  const correctCityCountry = analysis.correctCountry || extractCountry(question.explanation.ko);
  const wrongCityCountry = analysis.wrongCountry || extractCountry(question.explanation.ko.replace(analysis.correctOption, ''));
  
  if (wrongCityCountry !== '알 수 없음') {
    newExplanation = `${analysis.correctOption}는 ${correctCityCountry}의 도시이며, ${analysis.wrongOption}는 ${wrongCityCountry}의 도시입니다.`;
  } else {
    newExplanation = `${analysis.correctOption}는 ${targetCountry}의 도시입니다.`;
  }

  // 정답 인덱스는 그대로 유지 (정답 도시를 찾는 문제이므로)
  return {
    ...question,
    questionText: {
      ko: newQuestionText,
      en: `Which of the following cities belongs to ${targetCountry}?`,
    },
    correctIndex: question.correctIndex,
    explanation: {
      ko: newExplanation,
      en: question.explanation.en,
    },
  };
}

/**
 * 모든 문제 변환
 */
export function convertAllQuestions(questions: Question[]): Question[] {
  return questions.map(convertQuestion);
}


