export default function Tags({
  value,
  type,
}: {
  value: string[];
  type: "note" | "category";
}) {
  return (
    <ul className="flex w-full items-center gap-0.5 animate-text-slide">
      {value.map((tag) => (
        <li key={tag} className="px-2 py-1 underline inline-block">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
