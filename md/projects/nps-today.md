---
title: "NPS Today"
github: "https://github.com/yoon-jeong-ho15/nps-today-frontend"
link: "https://nps-today.vercel.app"
stack: ["React Router", "TypeScript", "TailwindCSS", "Python", "AWS Lambda", "Supabase"]
order: 4
description: "국민연금 트래커"
---

한국투자증권 API로 코스피 200 종목의 연기금 일별 매매동향을 자동 수집하고, 이를 웹에서 차트로 시각화하는 금융 데이터 트래킹 서비스입니다.

### 주요 특징
- **증권사 API 기반 수급 데이터 수집** : 한국투자증권 API를 활용해 코스피 200 종목의 연기금 순매수 수량 및 거래대금을 수집하고, 호출 레이트 리밋을 고려한 대기 처리 적용
- **Supabase 기반 데이터 파이프라인** : 날짜와 종목코드 기준 업서트(Upsert)로 중복 적재를 방지하고, 대량 데이터를 배치 단위로 안정적으로 적재하는 구조 설계
- **AWS Lambda 일별 자동화** : 하루치 데이터를 정기 수집하는 Lambda 함수를 별도 구성하여 간편하고 안정적인 데이터 자동 업데이트 스케줄링 구현
- **과거 데이터 보강 파이프라인** : 신규 종목 추가 시 기존 데이터의 빈 날짜 범위를 자동 조회하고 과거 순매수 내역을 다시 수집하여 채우는 유지보수 스크립트 마련
- **React 기반 금융 데이터 시각화** : React Router, TypeScript, TailwindCSS 기반 프론트엔드에서 누적된 수급 데이터를 종목별 직관적인 차트와 대시보드로 제공
