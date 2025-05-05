// import { fetchBoardById } from "@/lib/data";
// import { Board } from "@/lib/definitions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  return (
    <div>
      <span>{id}</span>
      <span>edit page</span>
    </div>
  );
}
