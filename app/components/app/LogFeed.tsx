"use client";

import { CUISINE_BY_ID } from "../../lib/cuisines";
import { deleteLog, type LogEntry } from "../../lib/store";
import { PhaseChip, timeAgo } from "./shared";

function cuisineEmoji(entry: Extract<LogEntry, { kind: "food" }>) {
  if (entry.cuisine === "custom") return "🍽️";
  return CUISINE_BY_ID[entry.cuisine]?.emoji ?? "🍽️";
}

export default function LogFeed({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="flex flex-col gap-2">
      {logs.map((entry) => (
        <div
          key={entry.id}
          className="animate-log-pop group relative flex items-center gap-3 rounded-xl border border-clutch-ink/12 bg-white/80 p-2.5"
        >
          {/* thumb */}
          {entry.kind === "food" && entry.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.photo}
              alt={entry.item}
              className="h-12 w-12 shrink-0 rounded-lg border border-clutch-ink/15 object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-clutch-ink/12 text-xl"
              style={{
                backgroundColor: entry.kind === "med" ? "#FBE4D6" : "#FBD9E4",
              }}
            >
              {entry.kind === "food" ? cuisineEmoji(entry) : entry.isBirthControl ? "🌸" : "💊"}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate font-phone-display text-[13px] italic text-clutch-ink">
              {entry.kind === "food" ? entry.item : entry.name}
              {entry.kind === "food" && entry.portion ? (
                <span className="not-italic text-clutch-chocolate/55">
                  {" "}
                  · {entry.portion}
                </span>
              ) : null}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <PhaseChip phase={entry.phase} size="sm" />
              <span className="font-phone-body text-[9px] text-clutch-chocolate/55">
                {entry.kind === "food" ? "logged" : "taken"} · {timeAgo(entry.ts)}
              </span>
            </div>
          </div>

          <button
            onClick={() => deleteLog(entry.id)}
            aria-label="remove log"
            className="shrink-0 rounded-full px-2 py-1 font-phone-body text-[11px] text-clutch-chocolate/30 opacity-0 transition-opacity hover:text-clutch-hot group-hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
