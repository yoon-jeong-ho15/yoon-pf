---
title: "yoon-pf"
github: "https://github.com/yoon-jeong-ho15/yoon-pf.git"
link: "https://yoonjeongho.site"
stack: ["Next.js", "TypeScript", "TailwindCSS", "Storybook", "remark", "rehype"]
order: 1
description: "자체 개발 블로그 엔진 & 포트폴리오"
---

기획부터 디자인, 개발, 배포까지 전 과정을 직접 수행한 Next.js 기반 개인 포트폴리오 및 개발 블로그입니다.

### 주요 특징
- **마크다운 기반 콘텐츠 시스템** : `remark`·`rehype` 파이프라인(수식, 코드 하이라이팅 등)을 구축하여 외부 CMS 없이 마크다운 파일만으로 다양한 문서 파싱 및 웹 콘텐츠 렌더링
- **프론트매터 맞춤형 구조화** : `gray-matter`로 추출한 메타데이터를 활용하여 블로그, 학습 노트 카테고리 트리, 프로젝트 소개 모달 등 콘텐츠 성격에 최적화된 UI 제공
- **인터랙티브 UI 및 SSR 최적화** : Next.js App Router 기반 SSR과 클라이언트 컴포넌트 분리, 드래그 카드 및 타이핑 효과 등 동적 인터랙션 적용
- **학습 노트 카테고리 및 통합 검색** : 디렉토리 구조 기반의 트리 탐색과 프론트매터 필드(태그, 주제 등) 대상 검색 및 키워드 하이라이트 기능 지원
- **독립적 개발 환경 및 속도 최적화** : 외부 링크 메타데이터 사전 프리패치·캐싱으로 로딩 속도 개선 및 Storybook, Vitest, Playwright 기반 UI 컴포넌트 개발 환경 구축
