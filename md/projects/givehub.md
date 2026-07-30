---
title: "GiveHub 기부허브"
github: "https://github.com/shpark47/GiveHub.git"
stack: ["SpringBoot", "Oracle DB", "MyBatis", "Thymeleaf", "HTML", "CSS", "JavaScript"]
order: 2
description: "크라우드 펀딩 플랫폼"
---

투명하고 효율적인 기부 문화 조성을 위해 기부 캠페인 관리부터 실시간 후원 결제, 이메일 인증, 기부자 등급 자동 산정 및 소식(News) 공유 기능을 제공하는 웹 서비스입니다.

### 주요 성과 및 구현 특징 :
1. Portone API 연동 및 실시간 기부자 등급 자동화
    - Portone(구 아임포트) REST API를 연동하여 안정적인 기부 결제 프로세스 구축.
    - 결제 완료 시 회원별 총 누적 기부 금액을 계산하여 등급(Bronze, Silver, Gold)을 실시간으로 자동 산정·갱신하고, DB 및 사용자 세션 상태 동기화 처리.
2. Spring Security & 이메일 인증 기반 Security architecture
    - Spring Security 6 및 Thymeleaf Extras를 적용해 일반 사용자/주최자/관리자 권한별 접근 제어(RBAC) 구현.
    - JavaMailSender를 활용해 회원가입 이메일 인증 및 계정/비밀번호 찾기 메일 발송 서비스 구축.
3. 기부 캠페인 & 소식(News) CRUD 및 서버 파일 동기화
    - 기부 캠페인 모금 현황 및 후원 소식 게시판 CRUD 기능 구현.
    - 게시글 작성/수정/삭제 시 본문 내 첨부 이미지 업로드 및 삭제 이벤트를 추적하여 DB 데이터와 서버 파일 시스템 자원을 실시간으로 동시 동기화 및 cleanup 처리.

### 주요 기여 사항
1. 데이터베이스 설계 주도 : 게시판 종류별(기부/소식) 테이블 분리 및 첨부파일 테이블 통합
2. 게시글 관리 전반 개발 : 웹 기반 텍스트 에디터(TinyMCE) 연동, 작성 상태에 따른 이미지 저장/삭제 경로 분리 로직 구현
3. 협업 프로세스 수립 : 기능별 Git 브랜치 전략 수립 및 주기적 동기화 체계 마련으로 협업 안정화
