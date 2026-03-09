import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "bg-gradient-to-b from-[#ededed]/25 to-white",
        "rounded-2xl sm:rounded-3xl shadow-xl",
        "border-[6px] border-white ring-1 ring-[#ededed]",
        "px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
