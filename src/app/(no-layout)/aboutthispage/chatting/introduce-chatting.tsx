"use client";

import Backtick from "../ui/backtick";

export default function IntroduceChatting() {
  return (
    <article>
      <h1>채팅</h1>
      <p>로그인을 하게되면 채팅 기능을 사용할 수 있습니다.</p>
      <p>
        저를 제외한 모든 사용자는 <Backtick str="friend_group" /> 번호를 가지고
        있는데, 같은 그룹 안에 있는 사용자들끼리는 자유롭게 채팅을 할 수 있고,
        그룹 채팅방 생성도 가능합니다.
      </p>
    </article>
  );
}
