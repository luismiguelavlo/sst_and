type MaterialIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

export function MaterialIcon({ name, filled = false, className }: Readonly<MaterialIconProps>) {
  return (
    <span
      className={["material-symbols-outlined", className].filter(Boolean).join(" ")}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}
