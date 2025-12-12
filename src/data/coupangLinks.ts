// src/data/coupangLinks.ts

export type CoupangItem = {
  title: string;
  url: string;
  tags: (
    | "quiz"
    | "travel"
    | "map"
    | "brain"
    | "city"
    | "device"
    | "world"
  )[];
};

/**
 * ⚠️ 중요
 * - 아래 url은 사용자 제공 쿠팡 파트너스 링크 그대로입니다.
 * - 수정 / 가공 / 변경 절대 금지
 */
export const COUPANG_ITEMS: CoupangItem[] = [
  { title: "루빅스 큐브(정품)", url: "https://link.coupang.com/a/dcsBiY", tags: ["brain"] },
  { title: "메탈 퍼즐 세트(브레인티저)", url: "https://link.coupang.com/a/dcsBGE", tags: ["brain"] },
  { title: "나무 조립 퍼즐", url: "https://link.coupang.com/a/dcsB8y", tags: ["brain"] },

  { title: "성인 두뇌훈련 책", url: "https://link.coupang.com/a/dcsCFa", tags: ["brain", "quiz"] },
  { title: "기억력 강화 퍼즐북", url: "https://link.coupang.com/a/dcsC9A", tags: ["brain", "quiz"] },
  { title: "논리 추론 퍼즐북", url: "https://link.coupang.com/a/dcsDxF", tags: ["brain", "quiz"] },
  { title: "집중력 강화 워크북", url: "https://link.coupang.com/a/dcsDXG", tags: ["brain"] },

  { title: "세계지도 벽포스터", url: "https://link.coupang.com/a/dcsEmP", tags: ["map", "world"] },
  { title: "한국/세계 지도 퍼즐", url: "https://link.coupang.com/a/dcsEGK", tags: ["map", "world"] },
  { title: "국기 맞추기 퍼즐", url: "https://link.coupang.com/a/dcsE64", tags: ["quiz", "world"] },

  { title: "세계 도시 도감", url: "https://link.coupang.com/a/dcsFqr", tags: ["city", "world"] },
  { title: "세계 국가 대백과", url: "https://link.coupang.com/a/dcsFIN", tags: ["world"] },
  { title: "도시·건물 스티커북", url: "https://link.coupang.com/a/dcsF22", tags: ["city"] },

  { title: "상식 퀴즈 1000문제", url: "https://link.coupang.com/a/dcsGDR", tags: ["quiz"] },
  { title: "세계 지리 퀴즈북", url: "https://link.coupang.com/a/dcsHbU", tags: ["quiz", "world"] },
  { title: "단어 추론 퍼즐북", url: "https://link.coupang.com/a/dcsHwM", tags: ["quiz"] },
  { title: "수도 맞추기 퀴즈북", url: "https://link.coupang.com/a/dcsHNO", tags: ["quiz", "world"] },
  { title: "국기·도시·국가 퀴즈북", url: "https://link.coupang.com/a/dcsIQ8", tags: ["quiz", "world", "city"] },

  { title: "세계 도시 엽서 세트", url: "https://link.coupang.com/a/dcsJtV", tags: ["city", "travel"] },
  { title: "여행 테마 스티커", url: "https://link.coupang.com/a/dcsJ9m", tags: ["travel"] },
  { title: "빈티지 지도 포스터", url: "https://link.coupang.com/a/dcsKOB", tags: ["map"] },

  { title: "스마트폰 거치대", url: "https://link.coupang.com/a/dcsLex", tags: ["device"] },
  { title: "태블릿 거치대", url: "https://link.coupang.com/a/dcsLyO", tags: ["device"] },
  { title: "터치펜", url: "https://link.coupang.com/a/dcsLPn", tags: ["device"] },
  { title: "블루라이트 차단 필름", url: "https://link.coupang.com/a/dcsL6q", tags: ["device"] },
  { title: "손가락 링/그립톡", url: "https://link.coupang.com/a/dcsMuj", tags: ["device"] },
];
