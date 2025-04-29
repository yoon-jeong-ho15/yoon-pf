import { fetchBoards } from "@/lib/data";

export default async function BoardList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const boards = await fetchBoards(query, currentPage);
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>작성일</th>
          <th>제목</th>
          <th>작성자</th>
        </tr>
      </thead>
      <tbody>
        {boards?.map((board) => (
          <tr key={board.id}>
            <td>
              {board.createdAt.substring(0, board.createdAt.indexOf("T"))}
            </td>
            <td>{board.title}</td>
            <td>{board.writer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
