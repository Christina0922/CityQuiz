/**
 * 문제 자동 QA 테스트 스크립트
 */

import { questions } from '../src/data/questions';

interface TestResult {
  questionId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  errors: string[];
  passed: boolean;
}

function testQuestions(): TestResult[] {
  const results: TestResult[] = [];
  
  // 랜덤으로 10개 문제 선택
  const testQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  
  for (const question of testQuestions) {
    const errors: string[] = [];
    
    // 1. 보기 2개 확인
    if (question.options.length !== 2) {
      errors.push(`보기는 정확히 2개여야 합니다. 현재: ${question.options.length}개`);
    }
    
    // 2. 정답 인덱스 확인
    if (question.correctIndex !== 0 && question.correctIndex !== 1) {
      errors.push(`정답 인덱스는 0 또는 1이어야 합니다. 현재: ${question.correctIndex}`);
    }
    
    // 3. 질문 문구 확인 (금지된 형태 체크)
    if (question.questionText.ko.includes('다음 중 도시는?')) {
      errors.push(`금지된 질문 형태: "다음 중 도시는?"`);
    }
    
    // 4. 질문이 "해당하지 않는 것은?" 형태인지 확인
    if (!question.questionText.ko.includes('해당하지 않는 것은?') && 
        !question.questionText.ko.includes('아닌 것은?')) {
      errors.push(`질문이 "해당하지 않는 것은?" 또는 "아닌 것은?" 형태가 아닙니다.`);
    }
    
    // 5. 설명이 정답만 언급하는지 확인
    const correctAnswer = question.options[question.correctIndex];
    const wrongAnswer = question.options[1 - question.correctIndex];
    
    if (!question.explanation.ko.includes(correctAnswer)) {
      errors.push(`설명에 정답(${correctAnswer})이 포함되어야 합니다.`);
    }
    
    if (question.explanation.ko.includes(wrongAnswer)) {
      errors.push(`설명에 오답(${wrongAnswer})을 언급하면 안 됩니다.`);
    }
    
    // 6. 설명이 두 도시를 동시에 설명하는지 확인
    const explanationParts = question.explanation.ko.split(/[이고,]/);
    const cityMentions = explanationParts.filter(part => 
      question.options.some(opt => part.includes(opt))
    );
    if (cityMentions.length > 1) {
      errors.push(`설명에 여러 도시를 동시에 언급하면 안 됩니다.`);
    }
    
    results.push({
      questionId: question.id,
      question: question.questionText.ko,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation.ko,
      errors,
      passed: errors.length === 0,
    });
  }
  
  return results;
}

// 테스트 실행
console.log('=== CityQuiz 문제 자동 QA 테스트 ===\n');
const results = testQuestions();

let passedCount = 0;
let failedCount = 0;

results.forEach((result, index) => {
  console.log(`\n[문제 ${index + 1}] ID: ${result.questionId}`);
  console.log(`질문: ${result.question}`);
  console.log(`보기: ${result.options[0]} vs ${result.options[1]}`);
  console.log(`정답: ${result.options[result.correctIndex]}`);
  console.log(`설명: ${result.explanation}`);
  
  if (result.passed) {
    console.log('✅ 통과');
    passedCount++;
  } else {
    console.log('❌ 실패');
    console.log('오류:');
    result.errors.forEach(error => console.log(`  - ${error}`));
    failedCount++;
  }
});

console.log('\n=== 테스트 결과 요약 ===');
console.log(`총 테스트: ${results.length}개`);
console.log(`✅ 통과: ${passedCount}개`);
console.log(`❌ 실패: ${failedCount}개`);
console.log(`통과율: ${((passedCount / results.length) * 100).toFixed(1)}%`);

if (failedCount === 0) {
  console.log('\n🎉 모든 테스트 통과!');
} else {
  console.log('\n⚠️ 일부 테스트 실패. 문제를 수정해주세요.');
}

