import type { ReactNode } from "react";

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-[15px] font-medium transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]";

  const brandGrad = "linear-gradient(135deg, rgb(198, 110, 209) 0%, rgb(217, 147, 226) 50%, rgb(232, 176, 240) 100%)";

  if (variant === "ghost") {
    const cls = `${base} text-[var(--color-primary)] bg-white/20 backdrop-blur-md border border-white/60 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-white/40 ${className}`;
    if (href) {
      return <a href={href} className={cls} onClick={onClick}>{children}</a>;
    }
    return <button className={cls} onClick={onClick}>{children}</button>;
  }

  const styles = "text-white shadow-[0_10px_30px_rgba(217,147,226,0.35)] hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-[1.07]";
  const cls = `${base} ${styles} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} style={{ background: brandGrad }} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} style={{ background: brandGrad }} onClick={onClick}>
      {children}
    </button>
  );
}
