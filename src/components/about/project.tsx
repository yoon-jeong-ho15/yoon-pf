"use client";

import { cn } from "@/lib/utils";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "@/components/ui/modal";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Project({
  title,
  github,
  link,
  stack,
  description,
  htmlContent,
}: {
  title: string;
  github: string;
  link?: string;
  stack?: string[];
  description?: string;
  htmlContent?: string;
}) {
  const isOnService = title === "yoon-pf" || title === "NPS Today";
  const isCurrent = title === "yoon-pf"
  return (
    <Modal>
      <ModalTrigger asChild>
        <div
          className={cn(
            "my-1 p-3 rounded-md cursor-pointer transition-all flex flex-col gap-1.5 border border-transparent",
            isCurrent
              ? "bg-hover-bg border-muted shadow-sm"
              : "hover:bg-hover-bg hover:border-muted/50 hover:shadow-sm"
          )}
        >
          <div className="flex flex-row items-center gap-2">
            {isCurrent ? (
              <div className="rounded-full w-2 h-2 bg-blue-500 animate-pulse-fast"></div>
            ) : (isOnService ? (
              <div className="rounded-full w-2 h-2 bg-green-600 animate-pulse-fast"></div>)
              : (<div className="rounded-full w-2 h-2 bg-yellow-500 animate-pulse-fast"></div>))}
            <span className="font-bold text-base tracking-tight">{title}</span>
          </div>
          {description && (
            <p className="text-sm text-text-secondary leading-snug">{description}</p>
          )}
          {stack && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {stack.map((item, i) => {
                if (item in stackData) {
                  const data = stackData[item as keyof typeof stackData];
                  return (
                    <span key={i} className={cn("px-2 py-0.5 text-[10px] rounded-md font-semibold border border-transparent", data.style)}>
                      {item}
                    </span>
                  );
                } else {
                  return (
                    <span key={i} className="px-2 py-0.5 text-[10px] bg-surface text-text-secondary rounded-md font-semibold border border-muted/50">
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
        <ModalHeader className="flex border-b border-muted pb-4">
          <div className="flex items-center justify-between">
            <ModalTitle>{title}</ModalTitle>
            <ModalClose className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-hover-bg">
              <XMarkIcon className="size-5" />
            </ModalClose>
          </div>
          <div className="mt-2 flex gap-2 text-blue-600 text-xs">
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="border-blue-500 border px-2 py-1 rounded-lg hover:bg-amber-200"
            >
              github
            </a>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="border-blue-500 border px-2 py-1 rounded-lg hover:bg-teal-100"
              >
                link
              </a>
            )}

          </div>
        </ModalHeader>

        {stack && (
          <div className="mb-4 border-b border-muted pb-4">
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
  SpringBoot: {
    style: "text-lime-700 bg-lime-100 dark:text-lime-300 dark:bg-lime-950/40",
  },
  TailwindCSS: {
    style: "text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/40",
  },
  Storybook: {
    style: "text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-950/40"
  }
};
