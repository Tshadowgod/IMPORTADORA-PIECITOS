export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="h-[28rem] animate-pulse rounded-3xl bg-jungle-800/20" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/80" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/80" />
        ))}
      </div>
    </div>
  );
}
