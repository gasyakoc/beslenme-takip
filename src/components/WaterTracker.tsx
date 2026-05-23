"use client";

interface WaterTrackerProps {
  currentMl: number;
  targetMl: number;
  onAdd: (ml: number) => void;
}

export function WaterTracker({ currentMl, targetMl, onAdd }: WaterTrackerProps) {
  const glasses = Math.floor(currentMl / 250);
  const targetGlasses = Math.ceil(targetMl / 250);
  const pct = Math.min((currentMl / targetMl) * 100, 100);

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">💧 Su Takibi</h3>
        <span className="text-sm text-zinc-500">
          {(currentMl / 1000).toFixed(1)}L / {(targetMl / 1000).toFixed(1)}L
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-blue-50">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {Array.from({ length: targetGlasses }).map((_, i) => (
          <div
            key={i}
            className={`h-8 w-8 rounded-lg border-2 transition-colors ${
              i < glasses
                ? "border-blue-400 bg-blue-100"
                : "border-zinc-200 bg-zinc-50"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        {[250, 500].map((ml) => (
          <button
            key={ml}
            onClick={() => onAdd(ml)}
            className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            +{ml}ml
          </button>
        ))}
        <button
          onClick={() => onAdd(-250)}
          disabled={currentMl <= 0}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 disabled:opacity-30"
        >
          −
        </button>
      </div>
    </section>
  );
}
