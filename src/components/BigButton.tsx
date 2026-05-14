import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  icon?: ReactNode;
}

const VARIANTS: Record<NonNullable<BigButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-amber-400 to-amber-500 text-white border-amber-600 shadow-amber-300/60",
  secondary:
    "bg-gradient-to-b from-sky-400 to-sky-500 text-white border-sky-600 shadow-sky-300/60",
  ghost:
    "bg-white text-stone-700 border-stone-300 shadow-stone-200/60",
  danger:
    "bg-gradient-to-b from-rose-400 to-rose-500 text-white border-rose-600 shadow-rose-300/60",
};

const SIZES: Record<NonNullable<BigButtonProps["size"]>, string> = {
  sm: "text-base px-5 py-2.5 rounded-xl",
  md: "text-lg px-7 py-3.5 rounded-2xl",
  lg: "text-2xl px-10 py-5 rounded-3xl",
};

export function BigButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  icon,
}: BigButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.93 }}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      className={`
        ${VARIANTS[variant]}
        ${SIZES[size]}
        font-bold border-b-4 shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
