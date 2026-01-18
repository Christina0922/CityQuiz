// src/types.ts
import type { CityData } from './data/cityData';

export type Difficulty = "high" | "mid" | "low";
export type Language = "ko" | "en";
export type Page = "home" | "quiz" | "stats";

export type CoupangTopic =
  | "general"
  | "korea"
  | "usa"
  | "japan"
  | "europe"
  | "asia"
  | "world"
  | "study"
  | "travel"
  | "map";

export type Question = {
  id: string;
  topic: CoupangTopic;
  promptKo: string;
  promptEn: string;
  options: Array<{ id: string; label: string }>;
  optionsEn: Array<{ id: string; label: string }>;
  correctOptionId: string;
  explanationKo: string;
  explanationEn: string;
  cityData?: CityData; // 정답 도시의 메타데이터 (나라명, 좌표, 설명 등)
};
