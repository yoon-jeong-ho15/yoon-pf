"use client";

import Backtick from "../ui/backtick";
import BlogProcessDiagram from "./divs/BlogProcessDiagram";

export default function Blog() {
  return (
    <article>
      <h1>블로그 기능 소개</h1>
      <p>
        이 프로젝트의 블로그는 Markdown 파일을 기반으로 구축된 정적
        사이트(Static Site)입니다. 개발 관련 학습 내용이나 프로젝트 기록을 쉽게
        작성하고 게시할 수 있도록 설계되었습니다.
      </p>

      <h2>핵심</h2>
      <p>
        블로그 기능은 성능, SEO, 그리고 유지보수의 편의성을 중심으로 다음 네
        가지 핵심 기술을 기반으로 구현되었습니다.
      </p>
      <ul>
        <li>
          <strong>정적 사이트 생성 (Static Site Generation, SSG)</strong>:{" "}
          <strong>Next.js</strong>의 SSG 기능을 활용하여, 모든 블로그 게시글을
          빌드 시점에 미리 HTML 파일로 생성합니다. 이 방식은 서버 측 렌더링이나
          클라이언트 측 렌더링에 비해 페이지 로딩 속도가 매우 빠르며, 검색 엔진
          최적화(SEO)에 유리합니다.
        </li>
        <li>
          <strong>Markdown 기반 콘텐츠</strong>: 모든 게시글은{" "}
          <Backtick str="/blogs" /> 디렉토리 내의 Markdown(
          <Backtick str=".md" />) 파일로 관리됩니다. 별도의 데이터베이스 없이
          파일 시스템을 그대로 활용하므로, Git을 통해 포스트를 버전 관리하고,
          텍스트 에디터로 쉽게 글을 작성 및 수정할 수 있습니다. 폴더 구조는
          그대로 카테고리 구조가 됩니다.
        </li>
        <li>
          <strong>서버 측 구문 강조(Syntax Highlighting)</strong>: 게시글 내
          코드 블록의 가독성을 높이기 위해 <Backtick str="highlight.js" />{" "}
          라이브러리를 사용합니다. 클라이언트의 부담을 줄이고 성능을 확보하기
          위해, 빌드 시점에 서버에서 <Backtick str="cheerio" />를 이용해 HTML을
          파싱하고 코드 블록에 하이라이팅 스타일을 미리 적용합니다.
        </li>
        <li>
          <strong>검색 및 분류</strong>: 파일 시스템에서 읽어온 모든 게시글의
          메타데이터(frontmatter)를 기반으로 검색 및 페이지네이션 기능을
          구현했습니다. 사용자는 제목이나 내용의 키워드를 통해 원하는 게시글을
          빠르게 찾을 수 있습니다.
        </li>
      </ul>

      <h2>데이터 흐름</h2>
      <p>
        블로그의 데이터 흐름은 크게 &apos;빌드 시점&apos;과 &apos;사용자 요청
        시점&apos;으로 나뉩니다.
      </p>
      <ol>
        <li>
          <strong>빌드 시점 (Build Time)</strong>
          <ol>
            <li>
              <Backtick str="getCategoryTree" /> 함수가{" "}
              <Backtick str="/blogs" /> 디렉토리를 재귀적으로 탐색하여 전체
              카테고리 구조와 각 카테고리에 속한 글의 목록을 생성합니다.
            </li>
            <li>
              <Backtick str="getAllBlogIds" /> 함수가 모든 Markdown 파일의
              경로를 읽어 Next.js에게 정적으로 생성해야 할 페이지들의 목록을
              전달합니다.
            </li>
            <li>
              Next.js는 각 경로에 대해 <Backtick str="getBlogData" /> 함수를
              실행하여 개별 Markdown 파일의 내용(메타데이터 및 본문)을 읽고
              HTML로 변환합니다.
            </li>
            <li>
              변환된 HTML은 서버에서 <Backtick str="highlight.js" />를 통해 구문
              강조가 적용된 후, 최종적으로 정적 <Backtick str=".html" /> 파일로
              저장됩니다.
            </li>
          </ol>
        </li>
        <li>
          <strong>사용자 요청 시점 (Request Time)</strong>
          <ol>
            <li>
              사용자가 특정 블로그 게시글 URL(
              <Backtick str="/blog/..." />
              )을 요청하면, Next.js는 웹 서버처럼 미리 생성된 정적 HTML 파일을
              즉시 반환합니다.
            </li>
            <li>
              사용자가 블로그 검색 페이지(
              <Backtick str="/blog/search" />
              )에 접속하면, <Backtick str="getSortedBlogData" /> 함수가 빌드
              시점에 메모리에 로드된 전체 게시글 데이터에서 검색어에 맞는 글들을
              필터링하여 보여줍니다.
            </li>
          </ol>
        </li>
      </ol>

      <h2>구현 상세</h2>
      <BlogProcessDiagram />
      <h3>1. 콘텐츠 관리 및 파싱</h3>
      <ul>
        <li>
          <strong>Frontmatter</strong>: 각 Markdown 파일의 상단에는{" "}
          <Backtick str="---" />
          로 둘러싸인 YAML 형식의 frontmatter가 있어, `title`, `date`, `tags` 등
          게시글의 메타데이터를 정의합니다. <Backtick str="gray-matter" />{" "}
          라이브러리를 사용해 이 부분을 파싱합니다.
        </li>
        <li>
          <strong>Markdown to HTML</strong>: <Backtick str="remark" />와{" "}
          <Backtick str="remark-html" /> 라이브러리를 사용해 Markdown 텍스트를
          안전하게 HTML로 변환합니다.
        </li>
        <li>
          <strong>스타일링</strong>: <Backtick str="@tailwindcss/typography" />{" "}
          플러그인을 사용하여, 변환된 HTML에 일관되고 가독성 좋은 타이포그래피
          스타일을 적용합니다.
        </li>
      </ul>

      <h3>2. 페이지 렌더링</h3>
      <ul>
        <li>
          <strong>
            카테고리 페이지 (<Backtick str="/blog" />)
          </strong>
          : <Backtick str="getCategoryTree" />로 생성된 데이터를 받아{" "}
          <Backtick str="CategoryView" /> 컴포넌트가 전체 카테고리 구조를
          시각적으로 보여줍니다. 화면 크기에 따라 데스크톱용 트리 뷰와 모바일용
          리스트 뷰를 다르게 렌더링하여 반응형 UI를 구현했습니다.
        </li>
        <li>
          <strong>
            게시글 페이지 (<Backtick str="/blog/[...id]" />)
          </strong>
          : 동적 라우트 페이지로, <Backtick str="generateStaticParams" />를 통해
          모든 게시글에 대한 정적 페이지를 생성합니다. 서버에서 구문 강조까지
          마친 HTML을 <Backtick str="dangerouslySetInnerHTML" /> 속성을 통해
          렌더링합니다.
        </li>
        <li>
          <strong>
            검색 페이지 (<Backtick str="/blog/search" />)
          </strong>
          : <Backtick str="useSearchParams" /> 훅을 사용해 URL의 쿼리 파라미터를
          읽고, 이를 <Backtick str="getSortedBlogData" /> 함수에 전달하여 게시글
          목록을 동적으로 필터링하고 페이지네이션을 구현합니다.
        </li>
      </ul>
    </article>
  );
}
