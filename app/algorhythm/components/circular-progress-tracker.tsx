"use client";

import { Trophy, Flame, Award } from "lucide-react";

interface CircularProgressTrackerProps {
  stats: {
    total: number;
    solved: number;
    easyTotal: number;
    easySolved: number;
    mediumTotal: number;
    mediumSolved: number;
    hardTotal: number;
    hardSolved: number;
  };
}

export default function CircularProgressTracker({ stats }: CircularProgressTrackerProps) {
  const {
    total,
    solved,
    easyTotal,
    easySolved,
    mediumTotal,
    mediumSolved,
    hardTotal,
    hardSolved,
  } = stats;

  const overallPercent = total > 0 ? Math.round((solved / total) * 100) : 0;
  const easyPercent = easyTotal > 0 ? easySolved / easyTotal : 0;
  const mediumPercent = mediumTotal > 0 ? mediumSolved / mediumTotal : 0;
  const hardPercent = hardTotal > 0 ? hardSolved / hardTotal : 0;

  // Concentric Rings Dimensions
  const outerR = 70;
  const middleR = 54;
  const innerR = 38;

  const outerC = 2 * Math.PI * outerR;
  const middleC = 2 * Math.PI * middleR;
  const innerC = 2 * Math.PI * innerR;

  const easyOffset = outerC - easyPercent * outerC;
  const mediumOffset = middleC - mediumPercent * middleC;
  const hardOffset = innerC - hardPercent * innerC;

  return (
    <div className="w-full p-6 rounded-2xl border border-default-200/60 bg-background/90 backdrop-blur-md shadow-sm space-y-6">
      {/* Dashboard Title Header */}
      <div className="text-center space-y-2 border-b border-default-200/50 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Trophy className="h-3.5 w-3.5" />
          <span>Problem Solving Dashboard</span>
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          DSA Mastery Stats
        </h2>
      </div>

      {/* Vertical Circular Progress Ring */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 180 180">
            {/* Background Tracks */}
            <circle
              cx="90"
              cy="90"
              r={outerR}
              className="stroke-emerald-500/10 dark:stroke-emerald-500/20"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="90"
              cy="90"
              r={middleR}
              className="stroke-amber-500/10 dark:stroke-amber-500/20"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="90"
              cy="90"
              r={innerR}
              className="stroke-rose-500/10 dark:stroke-rose-500/20"
              strokeWidth="8"
              fill="transparent"
            />

            {/* Easy Ring (Outer - Emerald) */}
            <circle
              cx="90"
              cy="90"
              r={outerR}
              className="stroke-emerald-500 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={outerC}
              strokeDashoffset={easyOffset}
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Medium Ring (Middle - Amber) */}
            <circle
              cx="90"
              cy="90"
              r={middleR}
              className="stroke-amber-500 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={middleC}
              strokeDashoffset={mediumOffset}
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Hard Ring (Inner - Rose) */}
            <circle
              cx="90"
              cy="90"
              r={innerR}
              className="stroke-rose-500 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={innerC}
              strokeDashoffset={hardOffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Text Stats inside the Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-foreground tracking-tight">
              {solved}
            </span>
            <span className="text-xs font-semibold text-default-400">
              / {total}
            </span>
            <span className="text-[10px] uppercase font-bold text-default-500 tracking-wider mt-0.5">
              Solved
            </span>
          </div>
        </div>

        {/* Overall Completion Percentage Badge */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-default-600 bg-default-100/70 px-3 py-1.5 rounded-full border border-default-200/50">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>{overallPercent}% Complete</span>
        </div>
      </div>

      {/* Vertical Difficulty Breakdown Cards */}
      <div className="space-y-2.5 pt-2 border-t border-default-200/50">
        {/* Easy */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 transition-all hover:bg-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Easy
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-foreground">
              {easySolved}
            </span>
            <span className="text-xs text-default-400">/ {easyTotal}</span>
          </div>
        </div>

        {/* Medium */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 transition-all hover:bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Medium
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-foreground">
              {mediumSolved}
            </span>
            <span className="text-xs text-default-400">/ {mediumTotal}</span>
          </div>
        </div>

        {/* Hard */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 transition-all hover:bg-rose-500/10">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Hard
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-extrabold text-foreground">
              {hardSolved}
            </span>
            <span className="text-xs text-default-400">/ {hardTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
