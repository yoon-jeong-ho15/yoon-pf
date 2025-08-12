import Backtick from "../ui/backtick";

export default function Summary() {
  return (
    <article>
      <h1>개요</h1>
      <p>
        Next.js 기반의 포트폴리오, 블로그, 실시간 채팅 기능을 통합한 웹
        애플리케이션입니다.
      </p>

      <h2>기술 스택</h2>
      <ul>
        <li>
          <h3>Next.js</h3>
          <p>
            서버/클라이언트 컴포넌트를 분리하고, 블로그는 SSG, 채팅은 CSR로
            렌더링하여 성능과 상호작용을 모두 최적화.
            <br />
            <strong>TypeScript</strong>를 사용해 DB 스키마와 컴포넌트 props등의
            타입을 사전에 정의하여 데이터 무결성을 보장과 컴파일 오류 방지.
          </p>
        </li>
        <li>
          <h3>Supabase</h3>
          <p>
            PostgreSQL DB로 데이터를 관리하고, Realtime 기능으로 별도 서버 없이
            실시간 채팅을 구현.
          </p>
        </li>
        <li>
          <h3>TailwindCSS</h3>
          <p>
            Utility-First 방식으로 반응형 UI를 구축.
            <br />
            <Backtick str="@tailwindcss/typography" /> 플러그인을 사용해
            Markdown으로 작성된 블로그 글에 일관된 CSS를 적용.
          </p>
        </li>
      </ul>
    </article>
  );
}
