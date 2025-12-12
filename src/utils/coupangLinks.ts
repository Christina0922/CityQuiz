// src/utils/coupangLinks.ts
import { CoupangTopic } from "../types";

/**
 * ✅ 중요:
 * 아래 링크 배열을 "누님이 저에게 보내셨던 쿠팡 파트너스 링크"로 그대로 채우시면 됩니다.
 * (형식: "https://link.coupang.com/..." 같은 최종 파트너스 링크)
 *
 * 주제별로 배열을 나눠두면, 문제의 topic에 맞춰 랜덤으로 열립니다.
 */
const LINKS: Record<CoupangTopic, string[]> = {
  general: [
    // 여기에 넣으세요
  ],
  korea: [
    // 여기에 넣으세요
  ],
  usa: [
    // 여기에 넣으세요
  ],
  japan: [
    // 여기에 넣으세요
  ],
  europe: [
    // 여기에 넣으세요
  ],
  asia: [
    // 여기에 넣으세요
  ],
  world: [
    // 여기에 넣으세요
  ],
  study: [
    // 여기에 넣으세요
  ],
  travel: [
    // 여기에 넣으세요
  ],
  map: [
    // 여기에 넣으세요
  ],
};

function pickRandom(arr: string[]): string | null {
  if (!arr || arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? null;
}

export function getRandomCoupangLink(topic: CoupangTopic): string | null {
  // 1) 주제에 해당하는 링크가 있으면 그 안에서 랜덤
  const direct = pickRandom(LINKS[topic]);
  if (direct) return direct;

  // 2) 없으면 general에서 랜덤
  const fallback = pickRandom(LINKS.general);
  if (fallback) return fallback;

  // 3) 그래도 없으면 아무 주제에서 하나 랜덤 (최후의 안전장치)
  const all = Object.values(LINKS).flat().filter(Boolean);
  return pickRandom(all);
}
