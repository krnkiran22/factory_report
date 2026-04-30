import { format, parseISO, subDays } from "date-fns";
import type {
  CardInventory,
  DailyTrendPoint,
  FactoryDayReport,
  HourBucket,
  Worker,
} from "./types";
import { getFactory } from "./factories";

/**
 * Deterministic dummy data generator. Same (site_id, date) always returns
 * the same numbers so refreshes don't change reports. Mirrors the metric
 * shapes of `core/dal/product/report_v1` and `products.report_summary`.
 */

const SHIFT_START_HOUR = 8;
const SHIFT_HOURS = 10;
const CLIP_DURATION_HOURS = 0.05;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pickRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

function buildHourly(
  rng: () => number,
  workerCount: number,
  totalGoodHours: number,
): HourBucket[] {
  const baseShape = [0.55, 0.78, 0.86, 0.82, 0.45, 0.6, 0.74, 0.8, 0.7, 0.5];
  const noisy = baseShape.map((v) => Math.max(0.1, v + (rng() - 0.5) * 0.2));
  const sum = noisy.reduce((s, v) => s + v, 0);
  const normalized = noisy.map((v) => v / sum);
  const buckets: HourBucket[] = [];
  for (let i = 0; i < SHIFT_HOURS; i++) {
    const hourGoodHours = totalGoodHours * normalized[i];
    const goodMinutes = hourGoodHours * 60;
    const offMinutes = pickRange(rng, 1, 8);
    const badMinutes = Math.max(0, 60 - goodMinutes - offMinutes);
    const totalMinutes = goodMinutes + badMinutes + offMinutes;
    const hourClock = SHIFT_START_HOUR + i;
    const label = `${String(hourClock).padStart(2, "0")}:00`;
    const clipCount = Math.round(hourGoodHours / CLIP_DURATION_HOURS / Math.max(1, workerCount) * workerCount * pickRange(rng, 1.6, 2.2));
    const usableClipCount = Math.round(hourGoodHours / CLIP_DURATION_HOURS);
    buckets.push({
      hour_index: i,
      hour_label: label,
      working_pct: round2((goodMinutes / totalMinutes) * 100),
      not_working_pct: round2((badMinutes / totalMinutes) * 100),
      device_off_pct: round2((offMinutes / totalMinutes) * 100),
      good_minutes: round2(goodMinutes),
      bad_minutes: round2(badMinutes),
      off_minutes: round2(offMinutes),
      clip_count: clipCount,
      usable_clip_count: usableClipCount,
    });
  }
  return buckets;
}

function buildWorkers(rng: () => number, workerCount: number): Worker[] {
  const workers: Worker[] = [];
  const display = workerCount;
  for (let i = 0; i < display; i++) {
    const usable = Math.round(pickRange(rng, 60, 240));
    const total = usable + Math.round(pickRange(rng, 5, 60));
    const goodHours = round2(usable * CLIP_DURATION_HOURS);
    const productivityPct = round2((goodHours / SHIFT_HOURS) * 100);
    const avgQualityPct = round2((usable / total) * 100);
    workers.push({
      worker_id: `wrk-${i + 1}`,
      display_name: `Worker ${String(i + 1).padStart(3, "0")}`,
      device_id: `dev-${String(((i * 7) % 999) + 1).padStart(3, "0")}`,
      usable_clip_count: usable,
      total_clip_count: total,
      good_hours: goodHours,
      productivity_pct: productivityPct,
      avg_quality_pct: avgQualityPct,
    });
  }
  return workers.sort((a, b) => b.productivity_pct - a.productivity_pct);
}

function buildCardInventory(
  rng: () => number,
  deviceCount: number,
): CardInventory {
  const claimed = deviceCount * 2;
  const good = Math.round(claimed * pickRange(rng, 0.55, 0.78));
  const bad = Math.round(claimed * pickRange(rng, 0.04, 0.12));
  const empty = Math.round(claimed * pickRange(rng, 0.06, 0.18));
  const actual = good + bad + empty;
  return {
    claimed_card_count: claimed,
    actual_card_count: actual,
    good_card_count: good,
    empty_card_count: empty,
    bad_card_count: bad,
  };
}

export function getFactoryDayReport(
  siteId: string,
  isoDate: string,
): FactoryDayReport | null {
  const factory = getFactory(siteId);
  if (!factory) return null;
  const seed = hashSeed(`${siteId}|${isoDate}`);
  const rng = mulberry32(seed);

  const participantCount = Math.max(
    4,
    Math.round(factory.worker_count * pickRange(rng, 0.65, 0.95)),
  );
  const deviceCount = Math.max(
    2,
    Math.round(participantCount * pickRange(rng, 0.45, 0.85)),
  );
  const recordedHours = round2(
    deviceCount * pickRange(rng, 5.2, 9.4),
  );
  const goodHoursPerParticipant = round2(pickRange(rng, 3.4, 7.6));
  const goodHours = round2(goodHoursPerParticipant * participantCount * pickRange(rng, 0.7, 1.05));
  const cappedGood = Math.min(goodHours, recordedHours);
  const badHours = round2(Math.max(recordedHours - cappedGood, 0));
  const qualityPct = round2((goodHoursPerParticipant / SHIFT_HOURS) * 100);
  const usableClipCount = Math.round(cappedGood / CLIP_DURATION_HOURS);
  const totalClipCount = Math.round(usableClipCount * pickRange(rng, 1.15, 1.45));
  const evaluatedCount = Math.round(totalClipCount * pickRange(rng, 0.7, 0.95));
  const coveragePct = round2((evaluatedCount / Math.max(1, totalClipCount)) * 100);
  const cardInventory = buildCardInventory(rng, deviceCount);

  return {
    site_id: factory.site_id,
    recording_name: factory.recording_name,
    deployment_date: isoDate,
    participant_count: participantCount,
    device_count: deviceCount,
    recorded_hours: recordedHours,
    good_hours: cappedGood,
    bad_hours: badHours,
    good_hours_per_participant: goodHoursPerParticipant,
    quality_pct: qualityPct,
    coverage_pct: coveragePct,
    clip_count: totalClipCount,
    usable_clip_count: usableClipCount,
    evaluated_count: evaluatedCount,
    active_minutes: round2(cappedGood * 60),
    idle_minutes: round2(badHours * 60),
    card_inventory: cardInventory,
    total_sd_card_count:
      cardInventory.good_card_count +
      cardInventory.bad_card_count +
      cardInventory.empty_card_count,
    hourly_activity: buildHourly(rng, participantCount, cappedGood),
    workers: buildWorkers(rng, Math.min(20, participantCount)),
  };
}

export function getDailyTrend(siteId: string, anchorIso: string, days = 7): DailyTrendPoint[] {
  const anchor = parseISO(anchorIso);
  const out: DailyTrendPoint[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const day = subDays(anchor, d);
    const iso = format(day, "yyyy-MM-dd");
    const r = getFactoryDayReport(siteId, iso);
    if (!r) continue;
    out.push({
      date: iso,
      good_hours: r.good_hours,
      bad_hours: r.bad_hours,
      quality_pct: r.quality_pct,
      worker_count: r.participant_count,
    });
  }
  return out;
}

