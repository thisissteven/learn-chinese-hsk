export const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export const CHARACTERS_PER_PAGE = 50;
export const CHARACTERS_PER_LEVEL = {
  1: 150,
  2: 150,
  3: 300,
  4: 600,
  5: 1300,
  6: 2500,
};

export type Level = keyof typeof CHARACTERS_PER_LEVEL;

export type ChineseCharacter = {
  id: number;
  hanzi: string;
  pinyin: string;
  translations: Array<string>;
};
