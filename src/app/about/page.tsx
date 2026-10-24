import { cn } from "@/lib/utils";
import { d2Coding } from "../fonts";
import Image from "next/image";
import { MacosCard } from "@/components/about/macos-card";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

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
              <PhoneIcon className="size-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Phone</span>
            </div>
            <a
              href="tel:010-4021-0069"
              className="font-semibold text-base text-foreground hover:underline font-mono"
            >
              010-4021-0069
            </a>
          </div>
        </div>
      </MacosCard>
    </div>
  );
}