export default function Tags({ value }: { value: string[] }) {
  return (
    <ul className="flex items-center gap-0.5 ">
      {value.map((tag) => (
        <li
          key={tag}
          className="bg-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 px-1 py-0.5 rounded whitespace-nowrap"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
}
