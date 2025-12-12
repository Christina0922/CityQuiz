// src/types.ts
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
  choicesKo: string[];
  choicesEn: string[];
  correctIndex: number;
  explanationKo: string;
  explanationEn: string;
};
