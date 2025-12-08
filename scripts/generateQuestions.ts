/**
 * CityQuiz 문제 자동 생성 스크립트
 * 
 * 사용법:
 * npx ts-node scripts/generateQuestions.ts
 */

import { 
  generateQuestions, 
  exportQuestionsToJSON,
  QuestionGenerationData 
} from '../src/utils/questionGenerator';

// 예시 문제 데이터
const exampleData: QuestionGenerationData[] = [
  // 수도 맞추기
  {
    capital: {
      country: '대한민국',
      capital: '서울',
      wrongOption: '부산',
    },
  },
  {
    capital: {
      country: '일본',
      capital: '도쿄',
      wrongOption: '오사카',
    },
  },
  {
    capital: {
      country: '프랑스',
      capital: '파리',
      wrongOption: '리옹',
    },
  },
  
  // 국가 → 도시
  {
    countryToCity: {
      country: '대한민국',
      correctCity: '부산',
      wrongCity: '도쿄',
    },
  },
  {
    countryToCity: {
      country: '미국',
      correctCity: '뉴욕',
      wrongCity: '런던',
    },
  },
  
  // 대륙 → 도시
  {
    continentToCity: {
      continent: '아시아',
      correctCity: '서울',
      wrongCity: '파리',
    },
  },
  {
    continentToCity: {
      continent: '유럽',
      correctCity: '런던',
      wrongCity: '뉴욕',
    },
  },
  
  // 인구 비교
  {
    populationCompare: {
      city1: '서울',
      city2: '부산',
      city1Population: 9700000,
      city2Population: 3400000,
    },
  },
  
  // 랜드마크 기반
  {
    landmark: {
      landmark: '에펠탑',
      correctCity: '파리',
      wrongCity: '런던',
    },
  },
  {
    landmark: {
      landmark: '빅벤',
      correctCity: '런던',
      wrongCity: '파리',
    },
  },
  
  // 도시 → 국가
  {
    cityToCountry: {
      city: '서울',
      correctCountry: '대한민국',
      wrongCountry: '일본',
    },
  },
  {
    cityToCountry: {
      city: '도쿄',
      correctCountry: '일본',
      wrongCountry: '대한민국',
    },
  },
];

// 문제 생성 및 출력
const questions = generateQuestions(exampleData);
const jsonOutput = exportQuestionsToJSON(questions);

console.log('생성된 문제:');
console.log(jsonOutput);
console.log(`\n총 ${questions.length}개의 문제가 생성되었습니다.`);

