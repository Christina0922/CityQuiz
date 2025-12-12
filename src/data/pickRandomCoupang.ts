// src/utils/pickRandomCoupang.ts
import { COUPANG_ITEMS, CoupangItem } from "../data/coupangLinks";

export type CoupangContext =
  | "quiz"
  | "city"
  | "world"
  | "map"
  | "brain"
  | "travel"
  | "device";

export function pickRandomCoupangByContext(
  context: CoupangContext
): CoupangItem {
  // 1️⃣ context와 태그가 맞는 것만 필터
  const matched = COUPANG_ITEMS.filter((item) =>
    item.tags.includes(context as any)
  );

  // 2️⃣ 없으면 전체 풀로 fallback
  const pool = matched.length > 0 ? matched : COUPANG_ITEMS;

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
