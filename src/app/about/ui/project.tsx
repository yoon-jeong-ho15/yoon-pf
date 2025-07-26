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
  stack: string[];
  desc?: string;
}) {
  const stackData = {
    "Next.js": {
      link: "https://nextjs.org/",
      style: "text-gray-900 bg-gray-200",
    },
    "Next.auth": {
      link: "https://next-auth.js.org",
      style: "text-violet-800 bg-purple-100",
    },
    Supabase: {
      link: "https://supabase.com/",
      style: "text-green-800 bg-green-100",
    },
    Firebase: {
      link: "https://firebase.google.com/products/firestore",
      style: "text-red-800 bg-red-100",
    },
    TailwindCSS: {
      link: "https://tailwindcss.com",
      style: "text-sky-700 bg-sky-100",
    },
    Vercel: {
      link: "https://vercel.com/home",
      style: "text-stone-900 bg-stone-200",
    },
  };
  const isMain = title === "yoon-pf";
  return (
    <div
      className={`my-2 p-1 py-2 rounded ${
        isMain ? "bg-gray-100 outline outline-stone-300" : "hover:bg-gray-100"
      }`}
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
                   border-blue-500 border-1 px-1 py-0.5 
                   rounded-lg hover:bg-amber-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            github
          </a>
          {link && (
            <a
              href={link}
              className="text-blue-600 text-sm ml-3 
                   border-blue-500 border-1 px-1 py-0.5 
                   rounded-lg hover:bg-teal-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              link
            </a>
          )}
          {about && (
            <a
              href={about}
              className="text-blue-600 text-sm ml-3 
                   border-blue-500 border-1 px-1 py-0.5 
                   rounded-lg hover:bg-teal-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              info
            </a>
          )}
        </div>
      </div>
      <div className="bg-white rounded w-fit px-1 py-0.5 border border-stone-400">
        {stack.map((item, i) => {
          if (item in stackData) {
            const data = stackData[item as keyof typeof stackData];
            return (
              <span key={i} className="mr-2">
                <a
                  href={data.link}
                  className={`${data.style} hover:font-semibold p-0.5`}
                >
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
      {desc && (
        <div className="bg-white rounded w-full p-1 border border-stone-400 mt-1">
          {desc}
        </div>
      )}
    </div>
  );
}
