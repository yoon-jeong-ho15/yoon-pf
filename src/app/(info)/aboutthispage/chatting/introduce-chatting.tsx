"use client";

import Backtick from "../ui/backtick";
// import ChatPage from "./divs/chat-page";
import DataFlowDiagram from "./divs/data-flow-diagram";

export default function IntroduceChatting() {
  return (
    <article>
      <h1>채팅 기능 소개</h1>
      <p>
        로그인한 사용자는 채팅 기능을 사용할 수 있습니다. 관리자를 제외한 모든
        사용자는 <Backtick str="friend_group" /> 번호를 가지며, 같은 그룹 내
        사용자들과 자유롭게 1:1 및 그룹 채팅이 가능합니다.
      </p>

      <h2>핵심</h2>
      <p>채팅 기능은 다음 네 가지 핵심 기술과 패턴을 기반해 구현되었습니다.</p>
      <ul>
        <li>
          <strong>실시간 통신</strong>: <strong>Supabase Realtime</strong>을
          사용하여 WebSocket 기반의 실시간 메시지 송수신을 구현했습니다.
          Supabase는 데이터베이스의 변경 사항을 감지하여 관련 클라이언트에게
          즉시 브로드캐스트할 수 있는 강력한 기능을 제공합니다.
        </li>
        <li>
          <strong>데이터 관리</strong>: <strong>Server Action</strong>을 통해
          서버 로직(DB 저장, 읽음 처리 등)을 안전하고 효율적으로 처리합니다.
          클라이언트가 API 엔드포인트를 직접 호출하는 대신, 서버에 정의된 함수를
          원격 프로시저처럼 호출하여 보안을 강화하고 코드베이스를 통합적으로
          관리합니다.
        </li>
        <li>
          <strong>상태 관리</strong>: React Context API를 활용한
          <Backtick str="ChatroomProvider" />를 만들어 채팅 관련 핵심 상태들을
          중앙에서 관리하고, 여러 컴포넌트가 props를 통해 상태를 전달받는
          &quot;Prop Drilling&apos; 문제를 해결합니다. 관리되는 상태들은 다음과
          같습니다:
          <ul>
            <li>
              <Backtick str="selectedChatroom" /> : 현재 활성화된 채팅방 ID
            </li>
            <li>
              <Backtick str="unreadCounts" /> : 모든 채팅방의 안 읽은 메시지 수
            </li>
            <li>
              <Backtick str="isSubmitting" /> : 메시지 전송 중 상태
            </li>
            <li>
              <Backtick str="isShowingAddChatroom" /> : 새 채팅방 생성 모달 표시
              여부
            </li>
          </ul>
        </li>
        <li>
          <strong>사용자 경험(UX)</strong>:{" "}
          <strong>낙관적 업데이트(Optimistic Update)</strong> 패턴을 적용하여
          사용자에게 빠르고 즉각적인 UI 피드백을 제공합니다. 서버 응답을
          기다리지 않고 UI를 먼저 변경하여 애플리케이션이 훨씬 빠릿하게
          느껴지도록 합니다.
        </li>
      </ul>

      <h2>데이터 흐름도</h2>
      <DataFlowDiagram />

      <h2>데이터 흐름 상세</h2>
      <h3>1. 채팅방 선택 및 입장 (Read Flow)</h3>
      <p>
        사용자가 <Backtick str="ChatList" />
        에서 특정 채팅방을 클릭하면,
        <Backtick str="selectedChatroom" /> 상태가 변경되고, 여러 컴포넌트의
        `useEffect` 훅이 연쇄적으로 동작합니다.
      </p>
      <ol>
        <li>
          <strong>
            즉각적인 UI 반응 (in <Backtick str="ChatroomProvider" />)
          </strong>
          : 클릭 즉시, <Backtick str="setUnreadCounts" />를 호출하여
          클라이언트의 &apos;안 읽은 메시지 수&apos; 상태(
          <Backtick str="unreadCounts" /> Map)를 0으로 변경합니다. 이로써 UI의
          붉은색 뱃지가 서버 응답을 기다릴 필요 없이 바로 사라집니다.
        </li>
        <li>
          <strong>백그라운드 작업 (Asynchronous)</strong>:
          <ul>
            <li>
              <strong>
                DB 동기화 (in <Backtick str="ChatroomProvider" />)
              </strong>
              : <Backtick str="enterChatroom" /> 서버 액션을 호출하여, 서버의{" "}
              <Backtick str="chat_reads" /> 테이블에 해당 사용자의 마지막 읽은
              시각을 기록합니다. 이 작업은 UI를 전혀 방해하지 않습니다.
            </li>
            <li>
              <strong>
                과거 메시지 로딩 (in <Backtick str="MessageBox" />)
              </strong>
              : <Backtick str="getPrevChats" /> 서버 액션으로 해당 채팅방의 이전
              대화 기록을 DB에서 모두 가져와 <Backtick str="chatMessages" />
              상태에 저장하고 화면에 렌더링합니다.
            </li>
            <li>
              <strong>
                실시간 채널 구독 (in <Backtick str="MessageBox" />)
              </strong>
              : <Backtick str="supabase.channel(...)" />을 통해 이 채팅방 고유의
              채널을 구독(subscribe)합니다. 이 시점부터{" "}
              <Backtick str="new-message" />
              이벤트를 수신할 준비를 마칩니다.
            </li>
          </ul>
        </li>
      </ol>

      <h3>2. 메시지 송수신 (Write Flow)</h3>
      <p>
        메시지를 보내고 받는 과정은 DB와 실시간 채널의 유기적인 상호작용으로
        이루어집니다.
      </p>
      <ul>
        <li>
          <strong>메시지 전송</strong>:
          <ol>
            <li>
              사용자가 <Backtick str="MessageForm" />에 메시지를 입력하고
              &apos;전송&apos; 버튼을 누르면 <Backtick str="handleSubmit" />{" "}
              함수가 실행됩니다.
            </li>
            <li>
              <Backtick str="sendChatMessage" /> 서버 액션이 호출됩니다. 전송이
              진행되는 동안 <Backtick str="isSubmitting" /> 상태가 true가 되어
              버튼이 비활성화되고, 중복 전송을 방지합니다.
            </li>
            <li>
              서버 액션은 두 가지 핵심 작업을 수행합니다:
              <ul>
                <li>
                  <b>DB 저장</b>: <Backtick str="messages" /> 테이블에 새 메시지
                  레코드를 INSERT 합니다.
                </li>
                <li>
                  <b>실시간 이벤트 발행</b>: DB 저장이 완료된 새 메시지 객체를
                  페이로드(payload)에 담아, Supabase Realtime 채널로{" "}
                  <Backtick str="new-message" /> 이벤트를{" "}
                  <strong>브로드캐스트(Broadcast)</strong>합니다. 이 메시지는
                  전송자를 포함한 모든 구독자에게 전달됩니다.
                </li>
              </ul>
            </li>
          </ol>
        </li>
        <li>
          <strong>메시지 수신</strong>:
          <ul>
            <li>
              <Backtick str="MessageBox" />의 `useEffect`에 설정된 이벤트
              리스너(
              <Backtick str=".on('broadcast', ...)" />
              )가 브로드캐스트된 메시지를 감지합니다.
            </li>
            <li>
              리스너의 콜백 함수는 이벤트 페이로드에 담겨온 새 메시지 객체를
              기존 <Backtick str="chatMessages" /> 상태 배열에 추가하여 UI를
              업데이트합니다.
            </li>
            <li>
              만약 수신된 메시지의 발신자가 현재 사용자 본인이라면,{" "}
              <Backtick str="isSubmitting" /> 상태를 false로 되돌려 메시지
              입력창을 다시 활성화합니다.
            </li>
            <li>
              메시지 발신자가 본인인지 여부에 따라 메시지를 화면의 좌/우로
              정렬하여 표시합니다.
            </li>
          </ul>
        </li>
      </ul>
      <h3>3. 개별 메시지 읽음 확인</h3>
      <p>
        채팅방에 입장하는 것 외에, 사용자가 스크롤하여 특정 메시지를 실제로
        화면에서 보았는지 감지하는 기능도 구현되어 있습니다. 이는 브라우저의
        <Backtick str="IntersectionObserver" /> API를 사용합니다.
      </p>
      <ul>
        <li>
          <strong>감지 메커니즘</strong>: <Backtick str="MessageBox" /> 안의 각
          메시지 버블은 <Backtick str="IntersectionObserver" />에 의해
          감시됩니다.
        </li>
        <li>
          <strong>읽음 처리</strong>: 다른 사람이 보낸 메시지 버블이 화면에 70%
          이상 보이면(
          <Backtick str="threshold: 0.7" />
          ), <Backtick str="markSingleMessageAsRead" /> 서버 액션을 호출하여
          해당 메시지를 특정 사용자가 읽었음을 DB에 기록합니다.
        </li>
      </ul>
      <h1>알림</h1>
    </article>
  );
}
