/**
 * Domain types mirroring the Build AI factory report contract.
 *
 * Field names intentionally match `core/dal/product/report_v1` and
 * `products.report_summary` so dummy data can be swapped for real
 * API responses without changing UI code.
 */

export type Factory = {
  site_id: string;
  recording_name: string;
  team: string;
  partner_org: string;
  industry: string;
  shift_hours: number;
  worker_count: number;
};

export type HourBucket = {
  hour_index: number;
  hour_label: string;
  working_pct: number;
  not_working_pct: number;
  device_off_pct: number;
  good_minutes: number;
  bad_minutes: number;
  off_minutes: number;
  clip_count: number;
  usable_clip_count: number;
};

export type Worker = {
  worker_id: string;
  display_name: string;
  device_id: string;
  usable_clip_count: number;
  total_clip_count: number;
  good_hours: number;
  productivity_pct: number;
  avg_quality_pct: number;
};

export type CardInventory = {
  claimed_card_count: number;
  actual_card_count: number;
  good_card_count: number;
  empty_card_count: number;
  bad_card_count: number;
};

export type FactoryDayReport = {
  site_id: string;
  recording_name: string;
  deployment_date: string;
  participant_count: number;
  device_count: number;
  recorded_hours: number;
  good_hours: number;
  bad_hours: number;
  good_hours_per_participant: number;
  quality_pct: number;
  coverage_pct: number;
  clip_count: number;
  usable_clip_count: number;
  evaluated_count: number;
  active_minutes: number;
  idle_minutes: number;
  card_inventory: CardInventory;
  total_sd_card_count: number;
  hourly_activity: HourBucket[];
  workers: Worker[];
};

export type DailyTrendPoint = {
  date: string;
  good_hours: number;
  bad_hours: number;
  quality_pct: number;
  worker_count: number;
};

export type KpiSparkPoint = {
  date: string;
  value: number;
};

export type KpiDelta = {
  current: number;
  previous: number;
  delta_pct: number;
  spark: KpiSparkPoint[];
};

export type KpiBundle = {
  efficiency: KpiDelta;
  good_hours: KpiDelta;
  bad_hours: KpiDelta;
  workers: KpiDelta;
  devices: KpiDelta;
  sd_cards: KpiDelta;
  coverage: KpiDelta;
  clips: KpiDelta;
};

export type HeatmapCell = {
  date: string;
  efficiency_pct: number;
  good_hours: number;
};

export type WorkerHistogramBucket = {
  label: string;
  range: [number, number];
  count: number;
  fill: string;
};

export type NetworkComparison = {
  factory_efficiency_pct: number;
  network_avg_efficiency_pct: number;
  network_top_efficiency_pct: number;
  rank: number;
  total: number;
  factory_good_hours_per_worker: number;
  network_avg_good_hours_per_worker: number;
};

export type ShiftRhythm = {
  shift_minutes_total: number;
  shift_minutes_elapsed: number;
  shift_minutes_remaining: number;
  hours_completed: number;
  hours_remaining: number;
  pct_complete: number;
};
