---
title: "yoon-pf"
github: "https://github.com/yoon-jeong-ho15/yoon-pf.git"
link: "https://yoonjeongho.site"
stack: ["Next.js", "TypeScript", "TailwindCSS", "Storybook", "Vitest", "remark", "rehype"]
order: 1
description: "자체 개발 블로그 & 포트폴리오"
---

기획부터 디자인, 개발, 배포까지 전 과정을 직접 수행한 Next.js 기반 개인 포트폴리오 및 개발 블로그 서비스입니다. 외부 CMS나 데이터베이스 없이 마크다운 문서 파싱, 카테고리 트리 탐색, 메타데이터 프리패치 및 동적 UI 컴포넌트를 제공합니다.

### 주요 성과 및 구현 특징
1. 마크다운 파이프라인 & OG 메타데이터 프리패치
   - `remark`·`rehype` 파이프라인(수식 KaTeX, 코드 하이라이팅, 목차 추적 등)을 구축하여 외부 CMS 없이 마크다운 파일만으로 다양한 문서 파싱 및 웹 콘텐츠 렌더링.
   - 사전 빌드(`prebuild`) 시점 Node.js 스크립트로 마크다운 내 외부 링크의 OG 메타데이터(타이틀, 이미지, 아이콘)를 자동 수집·캐싱하여 클라이언트 로딩 지연 최적화.
2. Next.js App Router & SSG 최적화
   - 디렉토리 구조 기반의 카테고리 트리 파싱 및 Dynamic Routes(`generateStaticParams`)를 활용하여 블로그 및 학습 노트 문서의 정적 사이트 생성(SSG) 지원.
   - React Server Components(RSC)를 적용해 서버 사이드에서 마크다운 프론트매터 및 디렉토리 트리를 캐싱(`react cache`)하여 클라이언트 번들 크기 감소 및 초기로딩 성능 향상.
3. 인터랙티브 UI & 독립적 컴포넌트 개발 체계
   - 순수 CSS/JS 드래그 카드, 타이핑 모션(Intro), macOS 스타일 카드, 모달 뷰어 등 사용자 친화적인 동적 인터랙션 구축.
   - Storybook을 도입하여 UI 컴포넌트를 독립적으로 격리 개발하고, Vitest 및 Playwright 기반의 컴포넌트 단위 검증 체계 구축.
