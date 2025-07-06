import Search from "./ui/search";
import BoardList from "./ui/board-list";
import Write from "./ui/write";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-[90%] flex flex-col justify-center">
      <div className="flex items-center justify-center">
        <Search />
        {/* <Write /> */}
      </div>
      <div className="w-full mt-3">
        <BoardList query={query} currentPage={currentPage} />
      </div>
    </div>
  );
}
