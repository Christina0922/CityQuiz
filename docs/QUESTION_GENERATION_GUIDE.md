# CityQuiz 문제 자동 생성 시스템 가이드

## 개요

CityQuiz 문제 자동 생성 시스템은 엄격한 규칙에 따라 일관된 형식의 문제를 생성합니다.

## 문제 생성 규칙

### 1. 문제 템플릿 (6가지)

각 문제는 다음 6가지 템플릿 중 하나로만 생성됩니다:

#### (A) 수도 맞추기
```
"다음 중 <국가명>의 수도는?"
- 보기1
- 보기2
```

#### (B) 국가 → 도시
```
"다음 중 <국가명>에 있는 도시는?"
- 보기1
- 보기2
```

#### (C) 대륙 → 도시
```
"다음 중 <대륙명>에 위치한 도시는?"
- 보기1
- 보기2
```

#### (D) 도시 인구 비교
```
"다음 중 인구가 더 많은 도시는?"
- 보기1
- 보기2
```

#### (E) 랜드마크 기반
```
"다음 중 <랜드마크명>이 있는 도시는?"
- 보기1
- 보기2
```

#### (F) 도시 → 국가
```
"<도시명>은 어느 나라에 있을까요?"
- 보기1(국가)
- 보기2(국가)
```

### 2. 필수 조건

- ✅ 보기는 정확히 2개만 사용
- ✅ 정답은 반드시 1개만 존재
- ✅ 설명(explanation)은 반드시 포함
- ✅ 설명은 정답만 설명 (오답 언급 금지)

### 3. 절대 금지 규칙

다음 형태의 문제는 절대 허용하지 않습니다:

- ❌ "다음 중 도시인 것은?"
- ❌ 보기 2개 모두 정답일 가능성이 있는 문제
- ❌ 도시/수도 개념이 혼동될 수 있는 문제
- ❌ 하나의 설명에 서로 다른 도시 두 개를 동시에 설명하는 문장
- ❌ "둘 다 맞지만 하나만 골라라" 구조

### 4. 설명(explanation) 규칙

설명은 반드시 정답 **한 개만** 설명해야 합니다.

#### (A) 수도 문제 설명
```
"○○는 △△의 수도입니다."
```

#### (B) 국가 → 도시
```
"○○는 △△에 속한 도시입니다."
```

#### (C) 대륙 → 도시
```
"○○는 △△ 대륙에 위치한 도시입니다."
```

#### (D) 인구 비교형
```
"○○는 △△보다 인구가 더 많습니다."
```

#### (E) 랜드마크 기반
```
"○○에는 △△ 랜드마크가 있습니다."
```

#### (F) 도시 → 국가
```
"○○는 △△에 위치한 도시입니다."
```

## 사용 방법

### 1. 문제 생성 유틸리티 사용

```typescript
import { 
  generateQuestion, 
  generateQuestions,
  validateQuestion,
  QuestionGenerationData 
} from '../src/utils/questionGenerator';

// 단일 문제 생성
const data: QuestionGenerationData = {
  capital: {
    country: '대한민국',
    capital: '서울',
    wrongOption: '부산',
  },
};

const question = generateQuestion(data);
if (question) {
  const validation = validateQuestion(question);
  if (validation.valid) {
    console.log('문제 생성 성공:', question);
  } else {
    console.error('검증 실패:', validation.errors);
  }
}

// 여러 문제 생성
const dataList: QuestionGenerationData[] = [
  {
    capital: {
      country: '대한민국',
      capital: '서울',
      wrongOption: '부산',
    },
  },
  {
    countryToCity: {
      country: '미국',
      correctCity: '뉴욕',
      wrongCity: '런던',
    },
  },
];

const questions = generateQuestions(dataList);
```

### 2. 스크립트 실행

```bash
npx ts-node scripts/generateQuestions.ts
```

## 출력 JSON 포맷

```json
{
  "type": "capital",
  "question": "다음 중 대한민국의 수도는?",
  "options": ["서울", "부산"],
  "answer": "서울",
  "explanation": "서울는 대한민국의 수도입니다."
}
```

## 자동 검증

문제 생성 후 다음 항목이 자동으로 검사됩니다:

1. ✅ 보기 2개 중 둘 다 정답일 가능성 검사
2. ✅ 도시/국가 분류 오류 검사
3. ✅ 설명에 오답 언급 여부 검사
4. ✅ 금지된 문제 형태 검사
5. ✅ 설명에 정답 포함 여부 검사

오류 발생 시 문제를 다시 생성하고, 오류가 없어질 때까지 반복합니다.

## 예시

### 수도 맞추기
```typescript
{
  capital: {
    country: '일본',
    capital: '도쿄',
    wrongOption: '오사카',
  },
}
```

### 국가 → 도시
```typescript
{
  countryToCity: {
    country: '미국',
    correctCity: '뉴욕',
    wrongCity: '런던',
  },
}
```

### 대륙 → 도시
```typescript
{
  continentToCity: {
    continent: '아시아',
    correctCity: '서울',
    wrongCity: '파리',
  },
}
```

### 인구 비교
```typescript
{
  populationCompare: {
    city1: '서울',
    city2: '부산',
    city1Population: 9700000,
    city2Population: 3400000,
  },
}
```

### 랜드마크 기반
```typescript
{
  landmark: {
    landmark: '에펠탑',
    correctCity: '파리',
    wrongCity: '런던',
  },
}
```

### 도시 → 국가
```typescript
{
  cityToCountry: {
    city: '서울',
    correctCountry: '대한민국',
    wrongCountry: '일본',
  },
}
```

## 주의사항

1. **오답 선택**: 오답은 정답과 명확히 구분되는 것이어야 합니다.
2. **정보 정확성**: 수도, 인구, 랜드마크 정보는 최신 데이터를 사용해야 합니다.
3. **언어 일관성**: 문제와 설명의 언어는 일관되게 유지해야 합니다.
4. **검증 필수**: 생성된 모든 문제는 `validateQuestion` 함수로 검증해야 합니다.

