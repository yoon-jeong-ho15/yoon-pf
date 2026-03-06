export default function Tags({
  value,
  type,
}: {
  value: string[];
  type: "note" | "category";
}) {
  return (
    <ul className="flex items-center gap-0.5 ">
      {value.map((tag) => (
        <li
          key={tag}
          className="bg-emerald-200 px-1 py-0.5 rounded whitespace-nowrap"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
}
