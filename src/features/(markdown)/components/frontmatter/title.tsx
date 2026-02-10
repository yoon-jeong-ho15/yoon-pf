export default function Title({
  value,
  type,
}: {
  value: string;
  type: "category" | "note";
}) {
  const className = {
    category: "text-2xl",
    note: "text-3xl",
  };

  return <h2 className={`font-[600] mb-1 ${className[type]}`}>{value}</h2>;
}
