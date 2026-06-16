import { cn } from "@/lib/utils";

export default function Project({
  title,
  github,
  link,
  about,
  stack,
  desc,
}: {
  title: string;
  github: string;
  link?: string;
  about?: string;
  stack?: string[];
  desc?: string;
}) {
  const isMain = title === "yoon-pf";
  return (
    <div
      className={cn(
        "my-2 p-1 py-2 rounded",
        isMain ? "bg-hover-bg outline outline-muted" : "hover:bg-hover-bg"
      )}
    >
      <div className="flex flex-row mb-2 items-center">
        {isMain && (
          <div className="rounded-full w-2 h-2 mr-2 bg-blue-500 animate-pulse-fast"></div>
        )}
        <span>{title}</span>
        <div>
          <a
            href={github}
            className="text-blue-600 text-sm ml-3 
          border-blue-500 border px-1 py-0.5 
          rounded-lg hover:bg-amber-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            github
          </a>
          {link && (
            <a
              href={link}
              className="text-blue-600 text-sm ml-3 
            border-blue-500 border px-1 py-0.5 
            rounded-lg hover:bg-teal-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              link
            </a>
          )}
          {about && (
            <a
              href={about}
              className="text-blue-600 text-sm ml-3 
            border-blue-500 border px-1 py-0.5 
            rounded-lg hover:bg-lime-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              about
            </a>
          )}
        </div>
      </div>
      {stack && (
        <div className="bg-surface rounded px-1 py-0.5 border border-muted flex flex-wrap">
          {stack.map((item, i) => {
            if (item in stackData) {
              const data = stackData[item as keyof typeof stackData];
              return (
                <span key={i} className="mr-2">
                  <a className={cn(data.style, "hover:font-semibold p-0.5")}>
                    {item}
                  </a>
                </span>
              );
            } else {
              return (
                <span key={i} className="mr-2">
                  {item}
                </span>
              );
            }
          })}
        </div>
      )}
      {desc && (
        <div className="bg-surface rounded w-full p-1 border border-muted mt-1">
          {desc}
        </div>
      )}
    </div>
  );
}

const stackData = {
  "Next.js": {
    style: "text-foreground bg-layout-bg",
  },
  "Next.auth": {
    style: "text-violet-800 bg-purple-100 dark:text-violet-300 dark:bg-purple-950/40",
  },
  Firebase: {
    style: "text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-950/40",
  },
  TailwindCSS: {
    style: "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/40",
  },
  Vercel: {
    style: "text-foreground bg-layout-bg",
  },
  Vite: {
    style: "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-950/40",
  },
};
