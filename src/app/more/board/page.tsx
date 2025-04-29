import Search from "./search";

export default function Page() {
  return (
    <div>
      <div>
        <Search />
      </div>
      <table>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </table>
    </div>
  );
}
