---
title: "RM"
github: "https://github.com/JuHyeong2/RealMan.git"
stack: ["SpringBoot", "Oracle DB", "MyBatis", "Firebase", "Amazon S3", "Thymeleaf", "HTML", "CSS", "JavaScript", "WebSocket", "WebRTC"]
order: 3
description: "실시간 채팅 웹서비스"
---

Discord(디스코드)를 모티브로 서버 및 채널 단위로 사용자들이 모여 실시간 텍스트 채팅, DM, N:N 음성·화상 통화, 커스텀 환경설정을 이용할 수 있는 웹 커뮤니티 서비스입니다.

### 주요 성과 및 구현 특징 :
1. WebSocket & STOMP / Firebase 기반 실시간 메세징 최적화
    - Spring WebSocket 및 SockJS/STOMP 프로토콜을 구축하여 채널별 실시간 대화 및 1:1 DM 메세지의 양방향 브로드캐스팅 동기화 구현.
    - Google Firebase Cloud Firestore를 하이브리드 대화 저장소로 도입하여 대규모 채팅 데이터 읽기/쓰기 성능을 극대화하고 RDB 부하 경감.
2. WebRTC Mesh 커스텀 시그널링 서버 기반 N:N 음성 & 화상 통화 구축
    - STOMP 기반의 WebSocket 시그널링 서버(Offer/Answer/ICE Candidate 교환)를 직접 설계하여 별도 미디어 서버 없이 P2P 저지연 N:N 음성·화상 스트리밍 제공.
    - 마이크 음소거, 음량/스피커 조절, 비디오 화면 동적 제어 등 실시간 미디어 트랙 인터랙션 지원.
3. 서버·채널 도메인 설계 및 회원/보안/환경설정 통합 관리
    - Oracle DB & MyBatis 기반으로 계층형 서버·채널 구조, 친구 요청/수락/차단 및 멤버 초대/강퇴 관계형 데이터 모델(ERD) 구축.
    - Spring Security & 커스텀 WebSocket Interceptor 기반의 세션 검증, 이메일 인증(SMTP) 비번 재설정, AWS S3 프로필 이미지 연동 및 유저 맞춤 UI 테마 설정 기능 개발.

### 주요 기여 사항
1. 데이터베이스 설계 주도 : Firebase와 Oracle 간 저장 데이터 분리, 회원 및 관계 테이블(친구, 차단, 신고 등) 정규화
2. UI/UX 최적화 : 신규 참가자 입장 시 발생하는 불필요한 요청을 제어하여 참여자 목록 리렌더링 이슈 해결
3. 기획 및 문서화 : Use Case 다이어그램 작성 등 핵심 기능 기획, 팀원들을 위한 웹소켓 및 채팅 통신 기술 문서 작성/공유
