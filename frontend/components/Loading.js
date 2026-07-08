export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-[#CFA5E8] border-t-transparent animate-spin" />
      <p className="text-sm opacity-50">{text}</p>
    </div>
  );
}
