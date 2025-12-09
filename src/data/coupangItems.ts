/**
 * 쿠팡 파트너스 제품 데이터
 */

export interface CoupangItem {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const coupangItems: CoupangItem[] = [
  // 두뇌 강화 카테고리
  { id: '1', name: '루빅스 큐브(정품)', url: 'https://link.coupang.com/a/dcsBiY', category: 'brain' },
  { id: '2', name: '메탈 퍼즐 세트(브레인티저)', url: 'https://link.coupang.com/a/dcsBGE', category: 'brain' },
  { id: '3', name: '나무 조립 퍼즐', url: 'https://link.coupang.com/a/dcsB8y', category: 'brain' },
  { id: '4', name: '성인 두뇌훈련 책', url: 'https://link.coupang.com/a/dcsCFa', category: 'brain' },
  { id: '5', name: '기억력 강화 퍼즐북', url: 'https://link.coupang.com/a/dcsC9A', category: 'brain' },
  { id: '6', name: '논리 추론 퍼즐북', url: 'https://link.coupang.com/a/dcsDxF', category: 'brain' },
  { id: '7', name: '집중력 강화 워크북', url: 'https://link.coupang.com/a/dcsDXG', category: 'brain' },

  // 세계 도시 카테고리
  { id: '8', name: '세계지도 벽포스터', url: 'https://link.coupang.com/a/dcsEmP', category: 'city' },
  { id: '9', name: '한국/세계 지도 퍼즐', url: 'https://link.coupang.com/a/dcsEGK', category: 'city' },
  { id: '10', name: '국기 맞추기 퍼즐', url: 'https://link.coupang.com/a/dcsE64', category: 'city' },
  { id: '11', name: '세계 도시 도감', url: 'https://link.coupang.com/a/dcsFqr', category: 'city' },
  { id: '12', name: '세계 국가 대백과', url: 'https://link.coupang.com/a/dcsFIN', category: 'city' },
  { id: '13', name: '도시·건물 스티커북', url: 'https://link.coupang.com/a/dcsF22', category: 'city' },
  { id: '14', name: '세계 도시 엽서 세트', url: 'https://link.coupang.com/a/dcsJtV', category: 'city' },
  { id: '15', name: '여행 테마 스티커', url: 'https://link.coupang.com/a/dcsJ9m', category: 'city' },
  { id: '16', name: '빈티지 지도 포스터', url: 'https://link.coupang.com/a/dcsKOB', category: 'city' },

  // 퀴즈 카테고리
  { id: '17', name: '상식 퀴즈 1000문제', url: 'https://link.coupang.com/a/dcsGDR', category: 'quiz' },
  { id: '18', name: '세계 지리 퀴즈북', url: 'https://link.coupang.com/a/dcsHbU', category: 'quiz' },
  { id: '19', name: '단어 추론 퍼즐북', url: 'https://link.coupang.com/a/dcsHwM', category: 'quiz' },
  { id: '20', name: '수도 맞추기 퀴즈북', url: 'https://link.coupang.com/a/dcsHNO', category: 'quiz' },
  { id: '21', name: '국기·도시·국가 퀴즈북', url: 'https://link.coupang.com/a/dcsIQ8', category: 'quiz' },

  // 감성 카테고리
  { id: '22', name: '세계 도시 엽서 세트', url: 'https://link.coupang.com/a/dcsJtV', category: 'emotion' },
  { id: '23', name: '여행 테마 스티커', url: 'https://link.coupang.com/a/dcsJ9m', category: 'emotion' },
  { id: '24', name: '빈티지 지도 포스터', url: 'https://link.coupang.com/a/dcsKOB', category: 'emotion' },

  // 액세서리 카테고리
  { id: '25', name: '스마트폰 거치대', url: 'https://link.coupang.com/a/dcsLex', category: 'accessory' },
  { id: '26', name: '태블릿 거치대', url: 'https://link.coupang.com/a/dcsLyO', category: 'accessory' },
  { id: '27', name: '터치펜', url: 'https://link.coupang.com/a/dcsLPn', category: 'accessory' },
  { id: '28', name: '블루라이트 차단 필름', url: 'https://link.coupang.com/a/dcsL6q', category: 'accessory' },
  { id: '29', name: '손가락 링/그립톡', url: 'https://link.coupang.com/a/dcsMuj', category: 'accessory' }
];

/**
 * 카테고리 매핑
 */
export const categoryMap: Record<string, string> = {
  'brain': 'brain',
  'city': 'city',
  'quiz': 'quiz',
  'emotion': 'emotion',
  'accessory': 'accessory'
};

/**
 * 카테고리별 캐시 (1시간 유지)
 */
interface CategoryCache {
  item: CoupangItem | null;
  timestamp: number;
}

var categoryCache: Record<string, CategoryCache> = {};

var CACHE_DURATION = 60 * 60 * 1000; // 1시간 (밀리초)

/**
 * 카테고리별 랜덤 아이템 반환 (1시간 캐싱)
 * undefined를 반환하지 않도록 보장
 */
export function getRandomItemByCategory(category: string): CoupangItem | null {
  // categoryMap 검증
  if (!category || typeof category !== 'string') {
    return null;
  }

  // categoryMap에 존재하는지 확인
  if (!categoryMap.hasOwnProperty(category)) {
    return null;
  }

  // coupangItems 배열 검증
  if (!coupangItems || !Array.isArray(coupangItems) || coupangItems.length === 0) {
    return null;
  }

  // 캐시 확인
  var cached = categoryCache[category];
  var now = Date.now();

  if (cached && cached.item && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.item;
  }

  // 해당 카테고리의 아이템 필터링
  var itemsInCategory: CoupangItem[] = [];
  for (var i = 0; i < coupangItems.length; i++) {
    if (coupangItems[i] && coupangItems[i].category === category) {
      itemsInCategory.push(coupangItems[i]);
    }
  }

  if (itemsInCategory.length === 0) {
    return null;
  }

  // 랜덤 선택
  var randomIndex = Math.floor(Math.random() * itemsInCategory.length);
  var selectedItem = itemsInCategory[randomIndex];

  if (!selectedItem) {
    return null;
  }

  // 캐시 저장
  categoryCache[category] = {
    item: selectedItem,
    timestamp: now
  };

  return selectedItem;
}
