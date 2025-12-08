/**
 * 문제 검증 스크립트
 * 모든 문제가 단일 타입 규칙을 만족하는지 확인
 */

import { questions } from '../src/data/questions';

interface ValidationResult {
  questionId: number;
  passed: boolean;
  errors: string[];
}

function validateQuestions(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const question of questions) {
    const errors: string[] = [];
    const questionText = question.questionText.ko;
    const explanation = question.explanation.ko;

    // 1. 질문 형식 검증
    if (!questionText.includes('다음 도시 중 어느 것이') || !questionText.includes('에 속하나요?')) {
      errors.push(`질문 형식 오류: "${questionText}" (올바른 형식: "다음 도시 중 어느 것이 {국가}에 속하나요?")`);
    }

    // 2. 보기 개수 검증
    if (question.options.length !== 2) {
      errors.push(`보기는 정확히 2개여야 합니다. 현재: ${question.options.length}개`);
    }

    // 3. 정답 인덱스 검증
    if (question.correctIndex !== 0 && question.correctIndex !== 1) {
      errors.push(`정답 인덱스는 0 또는 1이어야 합니다. 현재: ${question.correctIndex}`);
    }

    // 4. 금지된 설명 문구 검증
    const forbiddenPhrases = [
      '도시가 아니다',
      '수도는 도시다',
      '도시가 아닙니다',
      '수도는 도시입니다',
    ];
    for (const phrase of forbiddenPhrases) {
      if (explanation.includes(phrase)) {
        errors.push(`금지된 설명 문구 사용: "${phrase}"`);
      }
    }

    // 5. 해설에 정답 도시와 오답 도시의 국가가 모두 포함되어야 함
    const correctCity = question.options[question.correctIndex];
    const wrongCity = question.options[1 - question.correctIndex];

    if (!explanation.includes(correctCity)) {
      errors.push(`해설에 정답 도시(${correctCity})가 포함되어야 합니다.`);
    }

    if (!explanation.includes(wrongCity)) {
      errors.push(`해설에 오답 도시(${wrongCity})가 포함되어야 합니다.`);
    }

    // 6. 해설 형식 검증 (정답과 오답 모두 국가 설명 포함)
    const hasCountryInfo = explanation.includes('의 도시') || explanation.includes('의 도시이며');
    if (!hasCountryInfo) {
      errors.push(`해설에 국가 정보가 포함되어야 합니다. (예: "~는 ~의 도시이며")`);
    }

    // 7. 해설에 "이며" 또는 "이고"가 있어야 두 도시 모두 설명
    if (!explanation.includes('이며') && !explanation.includes('이고')) {
      errors.push(`해설에 정답과 오답 도시를 모두 설명해야 합니다. (예: "~이며, ~는")`);
    }

    results.push({
      questionId: question.id,
      passed: errors.length === 0,
      errors,
    });
  }

  return results;
}

// 검증 실행
console.log('=== 문제 검증 시작 ===\n');
const results = validateQuestions();

let passedCount = 0;
let failedCount = 0;

results.forEach((result, index) => {
  const question = questions.find(q => q.id === result.questionId);
  if (!question) return;

  console.log(`[문제 ${index + 1}] ID: ${result.questionId}`);
  console.log(`질문: ${question.questionText.ko}`);
  console.log(`보기: ${question.options[0]} vs ${question.options[1]}`);
  console.log(`정답: ${question.options[question.correctIndex]}`);
  console.log(`해설: ${question.explanation.ko}`);

  if (result.passed) {
    console.log('✅ 통과\n');
    passedCount++;
  } else {
    console.log('❌ 실패');
    result.errors.forEach(error => console.log(`  - ${error}`));
    console.log('');
    failedCount++;
  }
});

console.log('=== 검증 결과 요약 ===');
console.log(`총 문제: ${results.length}개`);
console.log(`✅ 통과: ${passedCount}개`);
console.log(`❌ 실패: ${failedCount}개`);
console.log(`통과율: ${((passedCount / results.length) * 100).toFixed(1)}%`);

if (failedCount === 0) {
  console.log('\n🎉 모든 문제가 규칙을 만족합니다!');
} else {
  console.log('\n⚠️ 일부 문제가 규칙을 위반합니다. 수정이 필요합니다.');
  process.exit(1);
}

