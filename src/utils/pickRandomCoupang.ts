// src/utils/pickRandomCoupang.ts

import { COUPANG_ITEMS, CoupangItem } from "../data/coupangLinks";

export type CoupangContext =
  | "quiz"
  | "city"
  | "map"
  | "brain"
  | "travel"
  | "device"
  | "world";

const ONE_HOUR = 1000 * 60 * 60;

export function pickHourlyCoupangByContext(
  context: CoupangContext
): CoupangItem {
  const now = Date.now();
  const storageKey = `coupang_${context}`;

  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached) as {
        time: number;
        item: CoupangItem;
      };

      if (now - parsed.time < ONE_HOUR) {
        return parsed.item;
      }
    }
  } catch {
    // 깨진 캐시 무시
  }

  const matched = COUPANG_ITEMS.filter((item) =>
    item.tags.includes(context)
  );

  const pool = matched.length > 0 ? matched : COUPANG_ITEMS;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      time: now,
      item: picked,
    })
  );

  return picked;
}
