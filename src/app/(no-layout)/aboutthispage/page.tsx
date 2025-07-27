import IntroduceChatting from "./chatting/chatting";
import SideNav from "./side-nav";
import Backtick from "./ui/backtick";

export default function Page() {
  return (
    <div className="flex flex-row w-[100%]">
      <SideNav />
      <div className="flex flex-col prose w-full pl-[2%] max-w-[80%]">
        <article>
          <h1>개요</h1>
          <p>
            프로젝트 <Backtick str="yoon-pf" />는 Next.js 프레임워크를 사용해서
            만든 간단한 블로그이며 기본적으로 저를 소개하기 위해 만들어진
            웹앱입니다.
          </p>
          <p>
            그리고 이 <b>프로젝트 소개 페이지</b>는 <Backtick str="yoon-pf" />를
            만들면서 각 기능들을 어떻게 구현했는지 시각화 자료를 사용해 설명할
            목적으로 만들어진 페이지입니다.
          </p>
        </article>
        <IntroduceChatting />
      </div>
    </div>
  );
}
