---
title: "NPS Today"
github: "https://github.com/yoon-jeong-ho15/nps-today-frontend"
link: "https://nps-today.vercel.app"
stack: ["React Router", "TypeScript", "TailwindCSS", "Python", "AWS Lambda", "Supabase"]
order: 4
description: "국민연금 트래커"
---

개인 투자자가 국민연금의 주요 주식 매수세를 쉽게 파악할 수 있도록 일별 수급 데이터를 자동 추적하고 시각화하여 제공하는 웹 서비스입니다.

### 주요 성과 및 구현 특징 :
1. 서버리스 데이터 파이프라인 자동화
    - AWS Lambda & EventBridge를 활용해 평일 장 마감 후(16시) 당일 연기금 매매 데이터를 자동으로 수집·가공(Pandas)하여 Supabase DB에 배치 업서트(Upsert) 처리.
    - 고정 서버 비용을 0원에 가깝게 최적화하고 수집 실패 시 예외 처리 로직 구현.
2. 한국투자증권(KIS) Open API 연동
    - REST API 인증 토큰 관리 및 KOSPI 200 등 주요 종목별 연기금 순매수 수량·거래대금 데이터 동적 파싱.
3. 사용자 친화적 대시보드 & 시각화
    - 일자별,종목별 매수 현황 및 기간별 매수 우위 종목 트렌드 차트를 제공하여 매매 동향 파악 시간 단축.
