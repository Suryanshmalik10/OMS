import type { SVGProps } from "react";

type RailTelLogoProps = SVGProps<SVGSVGElement> & {
  showText?: boolean;
};

export function RailTelLogo({ showText = false, className, ...props }: RailTelLogoProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className} {...props}>
        <rect x="2" y="2" width="36" height="36" rx="11" fill="var(--primary)" />
        <path
          d="M20 14.5c-3.6 0-6.9 2.1-8.5 5.3a1.3 1.3 0 0 0 .6 1.7c.6.3 1.4 0 1.7-.6 1.2-2.3 3.5-3.8 6.2-3.8s5 1.5 6.2 3.8c.3.6 1.1.9 1.7.6.6-.3.9-1.1.6-1.7-1.6-3.2-4.9-5.3-8.5-5.3Zm0 5.2c-1.8 0-3.4.9-4.3 2.4-.3.5-.1 1.2.4 1.6.5.3 1.2.1 1.6-.4.5-.8 1.3-1.2 2.3-1.2s1.8.5 2.3 1.2c.3.5 1 .7 1.6.4.5-.3.7-1 .4-1.6-.9-1.5-2.6-2.4-4.3-2.4Zm0 5.3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
          fill="white"
        />
      </svg>
      {showText ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">
            RailTel OMS
          </p>
          <p className="truncate text-[10px] text-muted-foreground">Operations Control</p>
        </div>
      ) : null}
    </div>
  );
}
