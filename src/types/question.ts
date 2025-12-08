import { Difficulty } from './difficulty';

export interface Question {
  id: number;
  questionText: {
    ko: string;
    en: string;
  };
  options: [string, string];
  correctIndex: 0 | 1;
  difficulty: Difficulty;
  regionTag?: string;
  explanation: {
    ko: string;
    en: string;
  };
}

