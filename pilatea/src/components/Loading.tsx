export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
      <p className="text-sm opacity-50">{text}</p>
    </div>
  );
}