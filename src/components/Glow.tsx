import React from "react";

// Simple function to combine class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface GlowProps {
  variant?: "top" | "above" | "bottom" | "below" | "center";
  className?: string;
}

export function Glow({ variant = "top", className = "" }: GlowProps) {
  // Base class for the container
  const baseClass = "-z-1 absolute w-full";
  
  // Variant-specific classes
  const variantClass =
    variant === "top" ? "top-0" :
    variant === "above" ? "-top-[128px]" :
    variant === "bottom" ? "bottom-0" :
    variant === "below" ? "-bottom-[128px]" :
    variant === "center" ? "top-[50%]" : "";
  
  // Classes for the first glow element
  const glow1Class = cn(
    "absolute left-1/2 h-[512px] xl:h-[740px] w-[40%] xl:w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px]",
    variant === "center" && "-translate-y-1/2",
    variant === "bottom" && "bottom-0"
  );
  
  // Classes for the second glow element
  const glow2Class = cn(
    "absolute left-1/2 h-[256px] w-[100%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px]",
    variant === "center" && "-translate-y-1/2",
    variant === "bottom" && "bottom-0"
  );

  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      <div className={glow1Class} />
      <div className={glow2Class} />
    </div>
  );
}