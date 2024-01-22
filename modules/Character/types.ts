export type HanziApiResponse = {
  definition: {
    simplified: string;
    entries: Array<{
      pinyin: string;
      definitions: Array<string>;
    }>;
  };

  related: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  idioms: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  lessons: Array<{
    simplified: string;
    pinyin: string;
    english: string;
    audioUrl: string;
    lessonInfo: {
      level: string;
    };
  }>;
};
