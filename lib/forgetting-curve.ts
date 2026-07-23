/**
 * Compute real-time retention score (0–1) using Ebbinghaus formula.
 * retention = e^(-t/S)
 * where t = days since last review, S = stability (based on interval_days from SM-2)
 * 
 * Rules:
 * - UNSEEN problems → score 0 (they haven't been learned)
 * - MASTERED problems → score is clamped to minimum 0.6 (they decay slower)
 * - If lastReviewedAt is null → score 0
 * - S (stability) = max(intervalDays, 1) to avoid division by zero
 */
export function getRetentionScore(
  lastReviewedAt: string | null,
  intervalDays: number,
  status: string
): number {
  if (status === 'UNSEEN' || !lastReviewedAt) return 0;
  
  const now = new Date();
  const lastReview = new Date(lastReviewedAt);
  const daysSinceReview = (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24);
  
  const stability = Math.max(intervalDays, 1);
  const retention = Math.exp(-daysSinceReview / stability);
  
  // Mastered problems decay slower
  if (status === 'MASTERED') return Math.max(retention, 0.6);
  
  return Math.max(0, Math.min(1, retention));
}

/**
 * Map a retention score (0–1) to an HSL color string.
 * The gradient goes: red (0) → orange (0.3) → yellow (0.5) → green (1)
 * Uses HSL hue interpolation: 0° (red) → 142° (green)
 */
export function getRetentionColor(score: number): string {
  if (score === 0) return 'hsl(0, 0%, 80%)'; // Unseen/gray
  const hue = Math.round(score * 142);
  const saturation = 70 + Math.round(score * 10);
  const lightness = 45 + Math.round((1 - score) * 10);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get a human-readable label for the retention level.
 */
export function getRetentionLabel(score: number): string {
  if (score === 0) return 'Not Started';
  if (score >= 0.8) return 'Fresh';
  if (score >= 0.5) return 'Fading';
  if (score >= 0.25) return 'Stale';
  return 'Forgotten';
}

/**
 * Get CSS box-shadow glow based on retention score.
 */
export function getRetentionGlow(score: number): string {
  if (score === 0) return 'none';
  const color = getRetentionColor(score);
  const intensity = Math.round(score * 8);
  return `0 0 ${intensity}px ${color}`;
}

/**
 * Get urgency level for animation speed.
 * Returns: 'none' | 'slow' | 'medium' | 'fast'
 */
export function getUrgencyLevel(score: number, status: string): 'none' | 'slow' | 'medium' | 'fast' {
  if (status === 'UNSEEN' || score === 0) return 'none';
  if (score >= 0.5) return 'none';
  if (score >= 0.3) return 'slow';
  if (score >= 0.15) return 'medium';
  return 'fast';
}
