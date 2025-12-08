import { Question } from '../types/question';

export const questions: Question[] = [
  // Easy 난이도
  {
    id: 1,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['토론토', '시카고'],
    correctIndex: 1,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '토론토는 캐나다 온타리오 주의 도시이고, 시카고는 미국 일리노이 주의 도시입니다.',
      en: 'Toronto is a city in Ontario, Canada, and Chicago is a city in Illinois, United States.',
    },
  },
  {
    id: 2,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['밴쿠버', '뉴욕'],
    correctIndex: 1,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '밴쿠버는 캐나다 브리티시 컬럼비아 주의 도시이고, 뉴욕은 미국 뉴욕 주의 도시입니다.',
      en: 'Vancouver is a city in British Columbia, Canada, and New York is a city in New York, United States.',
    },
  },
  {
    id: 3,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['멕시코시티', '로스앤젤레스'],
    correctIndex: 1,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '멕시코시티는 멕시코의 수도이고, 로스앤젤레스는 미국 캘리포니아 주의 도시입니다.',
      en: 'Mexico City is the capital of Mexico, and Los Angeles is a city in California, United States.',
    },
  },
  {
    id: 4,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['호놀룰루', '오타와'],
    correctIndex: 0,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '호놀룰루는 미국 하와이 주의 도시이고, 오타와는 캐나다의 수도입니다.',
      en: 'Honolulu is a city in Hawaii, United States, and Ottawa is the capital of Canada.',
    },
  },
  {
    id: 5,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['보스턴', '몬트리올'],
    correctIndex: 0,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '보스턴은 미국 매사추세츠 주의 도시이고, 몬트리올은 캐나다 퀘벡 주의 도시입니다.',
      en: 'Boston is a city in Massachusetts, United States, and Montreal is a city in Quebec, Canada.',
    },
  },
  {
    id: 6,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['마이애미', '부에노스아이레스'],
    correctIndex: 0,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '마이애미는 미국 플로리다 주의 도시이고, 부에노스아이레스는 아르헨티나의 수도입니다.',
      en: 'Miami is a city in Florida, United States, and Buenos Aires is the capital of Argentina.',
    },
  },
  {
    id: 7,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['시애틀', '에드몬턴'],
    correctIndex: 0,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '시애틀은 미국 워싱턴 주의 도시이고, 에드몬턴은 캐나다 앨버타 주의 도시입니다.',
      en: 'Seattle is a city in Washington, United States, and Edmonton is a city in Alberta, Canada.',
    },
  },
  {
    id: 8,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['워싱턴 D.C.', '브라질리아'],
    correctIndex: 0,
    difficulty: 'easy',
    regionTag: 'North America',
    explanation: {
      ko: '워싱턴 D.C.는 미국의 수도이고, 브라질리아는 브라질의 수도입니다.',
      en: 'Washington D.C. is the capital of the United States, and Brasília is the capital of Brazil.',
    },
  },
  // Medium 난이도
  {
    id: 9,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['덴버', '멜버른'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '덴버는 미국 콜로라도 주의 주도이고, 멜버른은 호주 빅토리아 주의 도시입니다.',
      en: 'Denver is the capital of Colorado, United States, and Melbourne is a city in Victoria, Australia.',
    },
  },
  {
    id: 10,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['필라델피아', '퀸즈타운'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '필라델피아는 미국 펜실베이니아 주의 도시이고, 퀸즈타운은 뉴질랜드 남섬의 도시입니다.',
      en: 'Philadelphia is a city in Pennsylvania, United States, and Queenstown is a city in the South Island of New Zealand.',
    },
  },
  {
    id: 11,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['애틀랜타', '요하네스버그'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '애틀랜타는 미국 조지아 주의 주도이고, 요하네스버그는 남아프리카 공화국의 도시입니다.',
      en: 'Atlanta is the capital of Georgia, United States, and Johannesburg is a city in South Africa.',
    },
  },
  {
    id: 12,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['피닉스', '칸쿤'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '피닉스는 미국 애리조나 주의 주도이고, 칸쿤은 멕시코의 관광 도시입니다.',
      en: 'Phoenix is the capital of Arizona, United States, and Cancún is a tourist city in Mexico.',
    },
  },
  {
    id: 13,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['샌디에이고', '리우데자네이루'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '샌디에이고는 미국 캘리포니아 주의 도시이고, 리우데자네이루는 브라질의 도시입니다.',
      en: 'San Diego is a city in California, United States, and Rio de Janeiro is a city in Brazil.',
    },
  },
  {
    id: 14,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['미니애폴리스', '로테르담'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '미니애폴리스는 미국 미네소타 주의 도시이고, 로테르담은 네덜란드의 도시입니다.',
      en: 'Minneapolis is a city in Minnesota, United States, and Rotterdam is a city in the Netherlands.',
    },
  },
  {
    id: 15,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['샌안토니오', '부산'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '샌안토니오는 미국 텍사스 주의 도시이고, 부산은 대한민국의 도시입니다.',
      en: 'San Antonio is a city in Texas, United States, and Busan is a city in South Korea.',
    },
  },
  {
    id: 16,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['포트랜드', '케이프타운'],
    correctIndex: 0,
    difficulty: 'medium',
    regionTag: 'North America',
    explanation: {
      ko: '포트랜드는 미국 오레곤 주의 도시이고, 케이프타운은 남아프리카 공화국의 도시입니다.',
      en: 'Portland is a city in Oregon, United States, and Cape Town is a city in South Africa.',
    },
  },
  // Hard 난이도
  {
    id: 17,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['투손', '쿠리티바'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '투손(Tucson)은 미국 애리조나 주의 도시이고, 쿠리티바(Curitiba)는 브라질 파라나 주의 주도입니다.',
      en: 'Tucson is a city in Arizona, United States, and Curitiba is the capital of Paraná, Brazil.',
    },
  },
  {
    id: 18,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['리노', '바르나'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '리노(Reno)는 미국 네바다 주의 도시이고, 바르나(Varna)는 불가리아의 도시입니다.',
      en: 'Reno is a city in Nevada, United States, and Varna is a city in Bulgaria.',
    },
  },
  {
    id: 19,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['샬럿', '코펜하겐'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '샬럿(Charlotte)은 미국 노스캐롤라이나 주의 도시이고, 코펜하겐(Copenhagen)은 덴마크의 수도입니다.',
      en: 'Charlotte is a city in North Carolina, United States, and Copenhagen is the capital of Denmark.',
    },
  },
  {
    id: 20,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['올버니', '더블린'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '올버니(Albany)는 미국 뉴욕 주의 주도이고, 더블린(Dublin)은 아일랜드의 수도입니다.',
      en: 'Albany is the capital of New York, United States, and Dublin is the capital of Ireland.',
    },
  },
  {
    id: 21,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['프로비던스', '프라하'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '프로비던스(Providence)는 미국 로드아일랜드 주의 주도이고, 프라하(Prague)는 체코의 수도입니다.',
      en: 'Providence is the capital of Rhode Island, United States, and Prague is the capital of Czech Republic.',
    },
  },
  {
    id: 22,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['디모인', '뮌헨'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '디모인(Des Moines)은 미국 아이오와 주의 주도이고, 뮌헨(Munich)은 독일 바이에른 주의 도시입니다.',
      en: 'Des Moines is the capital of Iowa, United States, and Munich is a city in Bavaria, Germany.',
    },
  },
  {
    id: 23,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['비즈마크', '오슬로'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '비즈마크(Bismarck)는 미국 노스다코타 주의 주도이고, 오슬로(Oslo)는 노르웨이의 수도입니다.',
      en: 'Bismarck is the capital of North Dakota, United States, and Oslo is the capital of Norway.',
    },
  },
  {
    id: 24,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['체이니', '빈'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '체이니(Cheyenne)는 미국 와이오밍 주의 주도이고, 빈(Vienna)은 오스트리아의 수도입니다.',
      en: 'Cheyenne is the capital of Wyoming, United States, and Vienna is the capital of Austria.',
    },
  },
  {
    id: 25,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['컬럼비아', '마드리드'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '컬럼비아(Columbia)는 미국 사우스캐롤라이나 주의 주도이고, 마드리드(Madrid)는 스페인의 수도입니다.',
      en: 'Columbia is the capital of South Carolina, United States, and Madrid is the capital of Spain.',
    },
  },
  {
    id: 26,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['몽고메리', '로마'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '몽고메리(Montgomery)는 미국 앨라배마 주의 주도이고, 로마(Rome)는 이탈리아의 수도입니다.',
      en: 'Montgomery is the capital of Alabama, United States, and Rome is the capital of Italy.',
    },
  },
  {
    id: 27,
    questionText: {
      ko: '다음 중 도시는?',
      en: 'Which of the following is a city?',
    },
    options: ['오클라호마시티', '아테네'],
    correctIndex: 0,
    difficulty: 'hard',
    regionTag: 'North America',
    explanation: {
      ko: '오클라호마시티(Oklahoma City)는 미국 오클라호마 주의 주도이고, 아테네(Athens)는 그리스의 수도입니다.',
      en: 'Oklahoma City is the capital of Oklahoma, United States, and Athens is the capital of Greece.',
    },
  },
];

