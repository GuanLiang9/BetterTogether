import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const SIZES = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const RING_SIZES = {
  xs: "h-2 w-2",
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          SIZES[size],
          "rounded-full overflow-hidden flex items-center justify-center font-semibold",
          src ? "" : "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white",
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            RING_SIZES[size],
            "absolute bottom-0 right-0 rounded-full border-2 border-[#050a14]",
            online ? "bg-emerald-400" : "bg-slate-600",
          )}
        />
      )}
    </div>
  );
}
