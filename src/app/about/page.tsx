import { cn } from "@/lib/utils";
import { d2Coding } from "../fonts";
import Image from "next/image";
import { MacosCard } from "@/components/about/macos-card";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Page() {
  return (
    <div
      id="about-page"
      className={cn(
        d2Coding.className,
        "flex flex-col lg:grid lg:grid-cols-3 gap-4 px-8 items-start mb-16 min-h-screen",
      )}
    >
      <MacosCard title="윤정호 yoon jeong ho" randomizePosition containerSelector="#about-page" className="max-w-xs">
        <div className="flex p-1 bg-surface">
          <Image src="/s.jpg" alt="portrait" width={304} height={304} className="w-full h-auto rounded-sm object-cover" />
        </div>
        <div>
          born 1994
        </div>
        <div>
          loc : Seoul
        </div>
      </MacosCard>

      <MacosCard title="education" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <span className="font-semibold text-base mb-0.5">가톨릭대학교 Catholic University of Korea</span>
            <span className="text-text-secondary">철학과, Department of Philosophy</span>
            <span className="text-xs text-text-muted mt-2 font-mono">2021.03 - 2023.03</span>
          </div>
          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <span className="font-semibold text-base mb-0.5">
              독학학위제 Bachelor&apos;s Degree Examination for Self-Education
            </span>
            <span className="text-text-secondary">영문학 전공, English major</span>
            <span className="text-xs text-text-muted mt-2 font-mono">2020.01 - 2021.01</span>
          </div>
        </div>
      </MacosCard>

      <MacosCard title="contact" randomizePosition containerSelector="#about-page">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <div className="flex items-center gap-2 mb-1 text-text-secondary">
              <EnvelopeIcon className="size-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Email</span>
            </div>
            <a
              href="mailto:yoonjeongho33@gmail.com"
              className="font-semibold text-base text-foreground hover:underline break-all"
            >
              yoonjeongho33@gmail.com
            </a>
          </div>

          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <div className="flex items-center gap-2 mb-1 text-text-secondary">
              <GithubIcon className="size-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">GitHub</span>
            </div>
            <a
              href="https://github.com/yoon-jeong-ho15"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-base text-foreground hover:underline break-all"
            >
              yoon-jeong-ho15
            </a>
          </div>

          <div className="flex flex-col border border-muted/60 p-4 bg-surface rounded-md shadow-sm transition-colors hover:border-muted">
            <div className="flex items-center gap-2 mb-1 text-text-secondary">
              <InstagramIcon className="size-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Instagram</span>
            </div>
            <a
              href="https://instagram.com/whyalwaysme5"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-base text-foreground hover:underline break-all"
            >
              @whyalwaysme5
            </a>
          </div>
        </div>
      </MacosCard>
    </div>
  );
}