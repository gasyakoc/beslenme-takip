"use client";

interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroProgress({
  label,
  current,
  target,
  unit,
  color,
}: MacroProgressProps) {
  const pct = Math.min((current / target) * 100, 100);
  const over = current > target;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className={`tabular-nums ${over ? "text-amber-600 font-semibold" : "text-zinc-500"}`}>
          {Math.round(current)}/{target}
          {unit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: over ? "#d97706" : color,
          }}
        />
      </div>
    </div>
  );
}

interface CalorieRingProps {
  current: number;
  target: number;
  burned?: number;
}

export function CalorieRing({ current, target, burned = 0 }: CalorieRingProps) {
  const adjustedTarget = target + burned;
  const remaining = Math.max(adjustedTarget - current, 0);
  const pct = Math.min((current / adjustedTarget) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#f4f4f5" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={current > adjustedTarget ? "#d97706" : "#10b981"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold tabular-nums text-zinc-900">{Math.round(current)}</p>
        <p className="text-xs text-zinc-500">/ {adjustedTarget} kcal</p>
        {burned > 0 && (
          <p className="text-[10px] font-medium text-orange-600">
            +{burned} egzersiz
          </p>
        )}
        <p className="mt-1 text-xs font-medium text-emerald-600">
          {remaining > 0 ? `${Math.round(remaining)} kaldı` : "Hedef aşıldı"}
        </p>
      </div>
    </div>
  );
}
