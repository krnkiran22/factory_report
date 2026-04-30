# Factory Efficiency Report (standalone demo)

A standalone Next.js + TypeScript dashboard that visualizes per-factory
efficiency for the Build AI ingestion platform — using **dummy data only**.

The metric names and calculation rules mirror the real backend at
`core/dal/product/report_v1` so this UI can later be pointed at the live
API by swapping the data source in `src/lib/dummy-data.ts`.

## What it shows

For a selected **factory** and **date** you get:

- **Headline KPIs**: efficiency %, good hours, idle/bad hours, workers,
  devices, SD card counts, coverage %.
- **Hourly efficiency chart** — stacked working / idle / device-off
  percentages across the 10-hour shift (mirrors `build_shift_activity`
  in `core/dal/product/report_v1/_timeline.py`).
- **Clips per hour** — total uploaded vs usable clips per hour.
- **SD card inventory** — good / empty / bad / claimed / actually-returned.
- **7-day trend** — daily good vs bad hours and efficiency line.
- **Worker leaderboard** — sorted by productivity %, mirrors
  `productivity_pct_from_usable_clips` in `_helpers.py`
  (`usable_clips × 0.05h / 10h × 100`).

## Metric definitions used

| Metric | Formula | Source in repo |
|---|---|---|
| `good_hours` | `usable_duration_sec / 3600` | `migrations/654_*.sql` |
| `bad_hours` | `max(recorded_hours − good_hours, 0)` | `report_v1/site.py` |
| `quality_pct` (efficiency) | `good_hours_per_participant / 10 × 100` | `report_v1/_payload.py` |
| `productivity_pct` (worker) | `usable_clips × 0.05 / 10 × 100` | `report_v1/_helpers.py` |
| `coverage_pct` | `evaluated_count / clip_count × 100` | `migrations/654_*.sql` |
| `total_sd_card_count` | `good + bad + empty` | `core/dal/product/dashboard.py` |
| Hourly bucket % | `working / not_working / device_off` per hour slot | `_timeline.build_shift_activity` |

## Run it

```bash
cd ~/Desktop/factory-report
bun install   # already done by the scaffold
bun run dev
# open http://localhost:3000
```

Change factory/date via the controls at the top — URL syncs as
`?site=fac-...&date=YYYY-MM-DD` so the report is shareable.

## Switching to real data later

Replace `getFactoryDayReport(siteId, isoDate)` in
`src/lib/dummy-data.ts` with a fetch to:

```
GET /v1/product/reports/sites/{site_id}/aggregate
GET /v1/dashboard/recordings/detail   (for the factory list)
```

The TypeScript shapes in `src/lib/types.ts` already match the API
response keys.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- Recharts for charts
- date-fns for date math
- Bun for install + dev
