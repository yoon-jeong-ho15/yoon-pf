export const WORK_CATEGORIES = [
  {
    slug: "image",
    title: "Image",
    description: "이미지와 그래픽 작업을 모았습니다.",
  },
  {
    slug: "web",
    title: "Web",
    description: "웹사이트와 웹 프로젝트를 모았습니다.",
  },
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number]["slug"];

interface WorkBase {
  title: string;
  year?: string;
  image: string;
}

export interface WebWorkItem extends WorkBase {
  category: "web";
  description: string;
  features: string[];
  url: string;
}

export type WorkItem = WebWorkItem | (WorkBase & {
  category: Exclude<WorkCategory, "web">;
});

export const WORKS: WorkItem[] = [
  {
    category: "image",
    title: "또도가스",
    year: "2024",
    image: "/works/yoon.png",
  },
  {
    category: "image",
    title: "화장실금연",
    year: "2023",
    image: "/works/nonsmoking.png",
  },
  {
    category: "web",
    title: "FlashCards",
    image: "/works/web/flashcards-thumbnail.png",
    description: "기억하고 싶은 지식을 질문과 답으로 정리하고, 반복 학습으로 익히는 플래시카드 웹 서비스입니다.",
    features: [
      "주제별 덱과 폴더로 학습 자료 정리",
      "카드를 뒤집으며 질문과 답 반복 학습",
      "익힌 카드와 전체 달성률로 학습 현황 확인",
      "게스트 모드의 브라우저 저장과 Google 로그인 지원",
    ],
    url: "https://fc.yoonjeongho.com",
  },
  {
    category: "web",
    title: "NPS Today",
    image: "/works/web/nps-today-thumbnail.png",
    description: "국민연금의 코스피 순매수·순매도 동향을 날짜와 기업별로 살펴보는 데이터 대시보드입니다.",
    features: [
      "연속 순매수·순매도 종목과 누적 거래 트렌드 탐색",
      "캘린더와 히트맵으로 일별 거래 흐름 확인",
      "기업별 일별 매매와 30거래일 누적 추이 분석",
      "종목명과 종목 코드로 관심 기업 검색",
    ],
    url: "https://nps.yoonjeongho.com",
  },
];
