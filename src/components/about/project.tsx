"use client";

import { cn } from "@/lib/utils";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";

export default function Project({
  title,
  github,
  link,
  about,
  stack,
  description,
  htmlContent,
}: {
  title: string;
  github: string;
  link?: string;
  about?: string;
  stack?: string[];
  description?: string;
  htmlContent?: string;
}) {
  const isMain = title === "yoon-pf";
  return (
    <Modal>
      <ModalTrigger asChild>
        <div
          className={cn(
            "my-2 p-3 rounded cursor-pointer transition-colors flex flex-col gap-2",
            isMain ? "bg-hover-bg outline outline-muted" : "hover:bg-hover-bg"
          )}
        >
          <div className="flex flex-row items-center">
            {isMain && (
              <div className="rounded-full w-2 h-2 mr-2 bg-blue-500 animate-pulse-fast"></div>
            )}
            <span className="font-semibold text-lg">{title}</span>
          </div>
          {description && (
            <p className="text-sm text-text-muted">{description}</p>
          )}
          {stack && (
            <div className="flex flex-wrap gap-1.5">
              {stack.map((item, i) => {
                if (item in stackData) {
                  const data = stackData[item as keyof typeof stackData];
                  return (
                    <span key={i} className={cn("px-1.5 py-0.5 text-[10px] rounded font-medium border border-muted", data.style)}>
                      {item}
                    </span>
                  );
                } else {
                  return (
                    <span key={i} className="px-1.5 py-0.5 text-[10px] bg-surface text-foreground rounded font-medium border border-muted">
                      {item}
                    </span>
                  );
                }
              })}
            </div>
          )}
        </div>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <div className="mt-2 flex gap-2">
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm border-blue-500 border px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors"
            >
              github
            </a>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm border-blue-500 border px-2 py-1 rounded-lg hover:bg-teal-100 transition-colors"
              >
                link
              </a>
            )}
            {about && (
              <a
                href={about}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm border-blue-500 border px-2 py-1 rounded-lg hover:bg-lime-200 transition-colors"
              >
                about
              </a>
            )}
          </div>
        </ModalHeader>

        {stack && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2 text-text-muted">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((item, i) => {
                if (item in stackData) {
                  const data = stackData[item as keyof typeof stackData];
                  return (
                    <span key={i} className={cn("px-2 py-1 text-xs rounded font-medium border border-muted", data.style)}>
                      {item}
                    </span>
                  );
                } else {
                  return (
                    <span key={i} className="px-2 py-1 text-xs bg-surface text-foreground rounded font-medium border border-muted">
                      {item}
                    </span>
                  );
                }
              })}
            </div>
          </div>
        )}

        <h3 className="font-semibold text-sm mb-2 text-text-muted">Description</h3>
        {htmlContent ? (
          <ModalDescription className="text-sm text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </ModalDescription>
        ) : (
          <ModalDescription>
            상세 설명이 없습니다.
          </ModalDescription>
        )}
      </ModalContent>
    </Modal>
  );
}

const stackData = {
  "Next.js": {
    style: "text-slate-100 bg-slate-700 dark:text-slate-300 dark:bg-slate-800",
  },
  React: {
    style: "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/40",
  },
  TypeScript: {
    style: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950/40",
  },
  JavaScript: {
    style: "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-950/40",
  },
  Springboot: {
    style: "text-lime-700 bg-lime-100 dark:text-lime-300 dark:bg-lime-950/40",
  },
  TailwindCSS: {
    style: "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/40",
  },
};
