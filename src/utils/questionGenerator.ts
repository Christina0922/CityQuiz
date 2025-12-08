/**
 * CityQuiz 문제 자동 생성 시스템
 * 
 * 규칙:
 * - 보기는 정확히 2개만 사용
 * - 정답은 반드시 1개만 존재
 * - 설명(explanation)은 정답만 설명
 * - 6가지 템플릿 중 하나로만 생성
 */

export type QuestionType = 
  | 'capital'           // 수도 맞추기
  | 'country-to-city'   // 국가 → 도시
  | 'continent-to-city'  // 대륙 → 도시
  | 'population-compare' // 도시 인구 비교
  | 'landmark'          // 랜드마크 기반
  | 'city-to-country';  // 도시 → 국가

export interface GeneratedQuestion {
  type: QuestionType;
  question: string;
  options: [string, string];
  answer: string;
  explanation: string;
}

/**
 * 문제 생성 인터페이스
 */
export interface QuestionGenerationData {
  // 수도 맞추기
  capital?: {
    country: string;
    capital: string;
    wrongOption: string;
  };
  
  // 국가 → 도시
  countryToCity?: {
    country: string;
    correctCity: string;
    wrongCity: string;
  };
  
  // 대륙 → 도시
  continentToCity?: {
    continent: string;
    correctCity: string;
    wrongCity: string;
  };
  
  // 인구 비교
  populationCompare?: {
    city1: string;
    city2: string;
    city1Population: number;
    city2Population: number;
  };
  
  // 랜드마크 기반
  landmark?: {
    landmark: string;
    correctCity: string;
    wrongCity: string;
  };
  
  // 도시 → 국가
  cityToCountry?: {
    city: string;
    correctCountry: string;
    wrongCountry: string;
  };
}

/**
 * 문제 생성 함수
 */
export function generateQuestion(data: QuestionGenerationData): GeneratedQuestion | null {
  // 수도 맞추기
  if (data.capital) {
    const { country, capital, wrongOption } = data.capital;
    const options: [string, string] = Math.random() > 0.5 
      ? [capital, wrongOption] 
      : [wrongOption, capital];
    const answer = capital;
    
    return {
      type: 'capital',
      question: `다음 중 ${country}의 수도는?`,
      options,
      answer,
      explanation: `${capital}는 ${country}의 수도입니다.`,
    };
  }
  
  // 국가 → 도시
  if (data.countryToCity) {
    const { country, correctCity, wrongCity } = data.countryToCity;
    const options: [string, string] = Math.random() > 0.5 
      ? [correctCity, wrongCity] 
      : [wrongCity, correctCity];
    const answer = correctCity;
    
    return {
      type: 'country-to-city',
      question: `다음 도시 중 어느 것이 ${country}에 속하나요?`,
      options,
      answer,
      explanation: `${correctCity}는 ${country}의 도시이며, ${wrongCity}는 다른 국가의 도시입니다.`,
    };
  }
  
  // 대륙 → 도시
  if (data.continentToCity) {
    const { continent, correctCity, wrongCity } = data.continentToCity;
    const options: [string, string] = Math.random() > 0.5 
      ? [correctCity, wrongCity] 
      : [wrongCity, correctCity];
    const answer = correctCity;
    
    return {
      type: 'continent-to-city',
      question: `다음 도시 중 어느 것이 ${continent}에 속하나요?`,
      options,
      answer,
      explanation: `${correctCity}는 ${continent} 대륙에 위치한 도시이며, ${wrongCity}는 다른 대륙의 도시입니다.`,
    };
  }
  
  // 인구 비교
  if (data.populationCompare) {
    const { city1, city2, city1Population, city2Population } = data.populationCompare;
    const isCity1Larger = city1Population > city2Population;
    const answer = isCity1Larger ? city1 : city2;
    const options: [string, string] = Math.random() > 0.5 
      ? [city1, city2] 
      : [city2, city1];
    
    return {
      type: 'population-compare',
      question: '다음 중 인구가 더 많은 도시는?',
      options,
      answer,
      explanation: `${answer}는 ${isCity1Larger ? city2 : city1}보다 인구가 더 많습니다.`,
    };
  }
  
  // 랜드마크 기반
  if (data.landmark) {
    const { landmark, correctCity, wrongCity } = data.landmark;
    const options: [string, string] = Math.random() > 0.5 
      ? [correctCity, wrongCity] 
      : [wrongCity, correctCity];
    const answer = correctCity;
    
    return {
      type: 'landmark',
      question: `다음 중 ${landmark}이 있는 도시는?`,
      options,
      answer,
      explanation: `${correctCity}에는 ${landmark} 랜드마크가 있습니다.`,
    };
  }
  
  // 도시 → 국가
  if (data.cityToCountry) {
    const { city, correctCountry, wrongCountry } = data.cityToCountry;
    const options: [string, string] = Math.random() > 0.5 
      ? [correctCountry, wrongCountry] 
      : [wrongCountry, correctCountry];
    const answer = correctCountry;
    
    return {
      type: 'city-to-country',
      question: `${city}은 어느 나라에 있을까요?`,
      options,
      answer,
      explanation: `${city}는 ${correctCountry}에 위치한 도시입니다.`,
    };
  }
  
  return null;
}

/**
 * 문제 검증 함수
 */
export function validateQuestion(question: GeneratedQuestion): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 1. 보기 2개 검증
  if (question.options.length !== 2) {
    errors.push('보기는 정확히 2개여야 합니다.');
  }
  
  // 2. 정답이 보기에 포함되어 있는지 검증
  if (!question.options.includes(question.answer)) {
    errors.push('정답이 보기에 포함되어 있지 않습니다.');
  }
  
  // 3. 설명이 정답만 언급하는지 검증 (오답 언급 금지)
  const wrongOption = question.options.find(opt => opt !== question.answer);
  if (wrongOption && question.explanation.includes(wrongOption)) {
    errors.push('설명에 오답을 언급하면 안 됩니다.');
  }
  
  // 4. 금지된 문제 형태 검증
  if (question.question.includes('다음 중 도시인 것은?')) {
    errors.push('금지된 문제 형태입니다: "다음 중 도시인 것은?"');
  }
  if (question.question.includes('다음 중') && question.question.includes('도시는?')) {
    errors.push('금지된 문제 형태입니다: "다음 중 ... 도시는?" 형식은 사용할 수 없습니다.');
  }
  if (question.question.includes('어디가 도시') || question.question.includes('어느 것이 도시')) {
    errors.push('금지된 문제 형태입니다: "어디가 도시" 또는 "어느 것이 도시" 형식은 사용할 수 없습니다.');
  }
  
  // 5. 설명이 정답을 명확히 언급하는지 검증
  if (!question.explanation.includes(question.answer)) {
    errors.push('설명에 정답이 포함되어야 합니다.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 여러 문제 생성 함수
 */
export function generateQuestions(
  dataList: QuestionGenerationData[],
  maxRetries: number = 3
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  
  for (const data of dataList) {
    let question: GeneratedQuestion | null = null;
    let attempts = 0;
    
    while (attempts < maxRetries) {
      question = generateQuestion(data);
      if (question) {
        const validation = validateQuestion(question);
        if (validation.valid) {
          questions.push(question);
          break;
        } else {
          console.warn('문제 검증 실패:', validation.errors);
        }
      }
      attempts++;
    }
    
    if (!question) {
      console.error('문제 생성 실패:', data);
    }
  }
  
  return questions;
}

/**
 * JSON 형식으로 출력
 */
export function exportQuestionsToJSON(questions: GeneratedQuestion[]): string {
  return JSON.stringify(questions, null, 2);
}

