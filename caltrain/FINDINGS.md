# Caltrain per-train ridership: data reconnaissance findings

Research toward a schedule-based assignment model for estimating typical-weekday
ridership on each individual northbound Caltrain train. Date of research:
2026-08-11.

## TL;DR

- **Q1 (GTFS-RT occupancy_status): No.** Tested live with a 511 key:
  Caltrain's VehiclePositions entities carry no `occupancy_status`, no
  `occupancy_percentage`, no `multi_carriage_details`; SIRI's `Occupancy`
  element is null on every train. Control test the same minute: Muni 454/456
  and AC Transit 132/132 vehicles populated — the pipeline works, Caltrain
  just doesn't send it (APCs still in calibration). The assignment model is
  necessary.
- **Q2 (2016–2019 shape stability): the prior is trustworthy.** Adjacent-year
  Pearson correlation of per-train share of daily NB boardings is 0.94–0.99;
  median absolute share change is ~5% (2017→2018 is the noisy pair at ~9–10%,
  caused by a schedule change that cut four 2xx limiteds). Service-type shares
  are extremely stable: bullets 30.2–30.9%, limiteds 51.8–54.3%, locals
  15.3–17.3% of NB boardings across all four years.
- **Q3 (Tableau export): better than hoped.** The workbook itself is
  downloadable from Tableau Public, and its embedded extracts contain **daily**
  (not monthly) ridership: systemwide from 2016-01-01, by origin station from
  **2022-06-01**, and by fare media from 2023-11-12, through 2026-07-31.
  Extracted CSVs are in `data/`.
- **Q4a (MTC microdata): exists, request-only.** No public station-pair matrix
  (the report aggregates to a 9×9 zone matrix), but respondent-level 2024 O&D
  microdata is held by MTC and shared on request (PII-stripped) — contact
  Flavia Tsang, ftsang@bayareametro.gov.
- **Q4b (Portal/DTX & Business Plan): see below.**
- **Bonus (Cal-ITP stop metrics): see below.**

---

## Q1 — occupancy_status in Caltrain's GTFS-RT VehiclePositions

**Status: ANSWERED (empirically, with a 511 key): No. Caltrain does not
populate occupancy in either GTFS-RT or SIRI.**

Tested 2026-08-11 ~06:12 UTC (Mon ~11:12 PM Pacific, 5 trains live):

- `Transit/VehiclePositions?agency=CT`: 5 entities; `occupancy_status` unset
  on all, `occupancy_percentage` unset, `multi_carriage_details` empty.
- SIRI `VehicleMonitoring?agency=CT`: every `MonitoredVehicleJourney` carries
  an `Occupancy` key — **value `null` on all trains** (511 emits the field
  regardless of agency data).
- **Control test** (rules out "511 strips it" and the late-hour objection):
  same key, same minute — SF Muni `occupancy_status` populated on 454/456
  vehicles (EMPTY/MANY_SEATS/FEW_SEATS/STANDING_ROOM), AC Transit 132/132.
  Agencies that feed occupancy report it even on empty late-night vehicles,
  so Caltrain's 0/5 is absence of the data, not time of day.

Consistent with the EMU APCs still being in calibration. Worth a periodic
re-check (one request) — if occupancy ever appears, most of the assignment
model becomes a validation tool rather than the estimate. The SIRI
`MonitoredCall` does confirm aimed+expected arrival *and departure* times
per stop, so the live dwell-proxy plan stands.

Original access notes (kept for reference):

- The token request form (https://511.org/open-data/token) requires first/last
  name, email, TOS checkbox — and reCAPTCHA v3 plus Drupal antibot/honeypot
  fields, so it cannot be submitted programmatically. Tokens are emailed on
  submission. (No existing 511 token was findable in the requester's inbox.)
- `api.511.org` itself is reachable (returns 401 without a key, as expected).
- The 511 Open Data Specification – Transit (Oct 3 2022, 123 pp,
  https://511.org/sites/default/files/pdfs/511-SF-Bay-Open-Data-Specification-Transit_1.pdf)
  defines an optional `Occupancy` enum ("full, seatsAvailable, ...") on
  `MonitoredVehicleJourney` in both StopMonitoring and VehicleMonitoring
  responses (pp. 103, 108; examples pp. 60, 62, 87, 89). So the regional
  pipeline can carry occupancy; the spec does not say which agencies populate
  it. No public per-agency field inventory exists (the transitdata.net 511
  cheat-sheet predates the question and doesn't cover fields).
- Context that lowers expectations: Caltrain's EMU APCs were still in
  calibration/validation as of the Sept 2025 annual report, and Swiftly-style
  real-time crowding requires an APC integration — so a populated
  occupancy_status would be surprising, but the check is cheap once keyed.

**Next step (2 minutes of human time):** request a token, then:

```
curl "https://api.511.org/Transit/VehiclePositions?api_key=KEY&agency=CT" -o ct.pb
python -c "from google.transit import gtfs_realtime_pb2 as g; f=g.FeedMessage(); f.ParseFromString(open('ct.pb','rb').read()); [print(e.vehicle.vehicle.id, e.vehicle.HasField('occupancy_status'), e.vehicle.occupancy_status, len(e.vehicle.multi_carriage_details)) for e in f.entity]"
```

Check both `vehicle.occupancy_status` and `multi_carriage_details[].occupancy_status`,
across several peak-hour pulls (rate limit 60 req/hr). Also pull the SIRI
VehicleMonitoring endpoint and grep for `Occupancy`.

## Q2 — Stability of the by-train shape, 2016–2019

**Status: answered. The shape is stable; the 2019 prior is usable.**

Source files (all northbound-weekday sheets parsed; tidy CSVs in `data/`):

| Year | URL | Format / sheet | Label |
|---|---|---|---|
| 2019 | caltrain.com/media/1548/download | xlsx, `NBpaxAMWR` (+SB, + separate bike sheets) | AMWR (avg mid-week ridership) |
| 2018 | caltrain.com/media/1546/download | xlsx, `NBPax&Bikes-Hard` | "Avg Mid-Weekday Passengers" |
| 2017 | caltrain.com/media/1556/download | xls, `NBPax&Bikes` | "Avg Weekday Passengers" |
| 2016 | caltrain.com/media/1558/download | xls, `NBPax&Bike-Hard` | "Avg Weekday Passengers" |

Column structure: one On / Off / On Board triplet per train, stations as rows
(31 stations Gilroy→San Francisco NB). 2016–2018 put "Train NNN" in row 0 over
the Off column; 2019 puts the train number in a header row above each of the
three columns and adds Line#/ID columns. Every year balances (per-train
|ΣOn − ΣOff| ≤ 1 rider). NB weekday totals: 31,039 (2016), 31,006 (2017),
32,760 (2018), 31,596 (2019) — trains: 50, 50, 46, 46 (the June 2018 schedule
change dropped limiteds 241/245/249/253; train numbers otherwise carry over
1:1 across all four years).

Stability of each train's share of total NB daily boardings, matched by train
number:

| Pair | Pearson r | Spearman ρ | median \|Δshare\|/share | notes |
|---|---|---|---|---|
| 2016→2017 | 0.990 | 0.985 | 5.0% | |
| 2017→2018 | 0.935 | 0.945 | 9.8% | schedule change year; riders from cut trains redistribute (e.g. train 221 +66%) |
| 2018→2019 | 0.977 | 0.976 | 5.0% | |

Four-year coefficient of variation of share, for the 41 trains with ≥1%
average share: median 0.072, mean 0.092, max 0.255. Service-type totals are
nearly constant (share of NB boardings): bullet 30.8/30.9/30.4/30.2%, limited
51.8/51.8/54.3/54.1%, local 17.3/17.3/15.3/15.7% (2016/17/18/19).

Top NB trains in 2019 (share of NB day, with history): 227 (4.5→4.0→4.8→5.1%),
217 (4.5→4.7→4.7→5.0%), 329 (4.1→4.8→4.1→4.4%), 233, 319, 221, 225, 323 — the
familiar AM-peak bullets/limiteds; top trains carried ~1,300–1,600 boardings
and peaked at ~800–990 on board.

**Implication:** within a stable schedule, a train's share moves ~5% year over
year (relative), and the big movers are explained by schedule changes — which
supports transferring the 2019 prior to the current schedule **by service type
and time slot rather than train number**, exactly as planned. The 2018→2019
pair (46 matched trains, r = 0.977) is the cleanest single prior. Caveat: the
counts are Tue–Thu averages ("mid-weekday"), so the prior represents mid-week,
not Mon/Fri.

Reproduce: `analysis/parse_annual_counts.py`.

## Q3 — Tableau dashboard export

**Status: answered — and the workbook download beats crosstab export.**

`https://public.tableau.com/workbooks/CaltrainTotalRidershipEstimates.twb`
returns the full packaged workbook (download is enabled; ~2.3 MB zip). Inside
are two Hyper extracts (readable with `tableauhyperapi`):

1. **Daily ridership by origin station** (`sqlproxy.hyper`, 46,903 rows):
   `Date`, `Origin Station`, `Caltrain Day Type`, `Caltrain Ridership` (+ ~70
   precomputed dashboard columns). Systemwide daily totals run **2016-01-01 →
   2026-07-31**; per-station detail begins **2022-06-01** (28 stations) — a
   year and a half earlier than the Nov 2023 start visible in the dashboard UI.
   → `data/caltrain_daily_origin_station.csv`
2. **Daily ridership by fare media** (`sqlproxy 1.hyper`, 17,562 rows):
   `Date`, `Fare Distribution Channel`, `Ticket Type`, `Product Type`,
   `Fare Type`, `Caltrain Ridership`, **2023-11-12 → 2026-07-31**.
   → `data/caltrain_daily_fare_media.csv`

Validation: the extract's calendar-2019 average weekday ridership is 67,506
(matches the published ~65–68k era) and recent months read 40.0k (Jul 2025) →
48.9k (Jun 2026) average weekday riders, consistent with Caltrain's published
monthly estimates. Note the series is the fare-model estimate, with
`Free Fare Flag` marking promo periods.

This gives the model daily scaling targets by origin station (seasonality,
day-of-week, special events) rather than a single monthly systemwide number.
Reproduce: `analysis/extract_tableau_extracts.py`. Re-pull the workbook URL
any time for fresh data.

## Q4a — MTC 2024 survey microdata / station-pair O-D

**Status: answered — nothing public beyond the 9×9 zone matrix, but
respondent-level microdata exists and is available on request.**

- The public 2024 report (caltrain.com/media/34860; RSG, Jan 17 2025, 98 pp)
  contains only a weighted 9-zone-group boarding→alighting matrix (Table 3),
  and says explicitly the data "exist and were delivered in a more granular
  fashion (by boarding/alighting station)" but were aggregated for readability.
  Survey scale: 5,521 on-to-off completes (May 2–14, 2024) plus the full O-D
  instrument.
- MTC's Transit Passenger Survey data page
  (https://bayareametro.github.io/transit-passenger-surveys/data/) states:
  "To request access to the data summaries or the microdata, please contact
  Flavia Tsang at ftsang@bayareametro.gov" (415-778-6754).
- MTC's own code (github.com/BayAreaMetro/transit-passenger-surveys)
  references the internal deliverable `2024 Caltrain OD Data (sent
  11.7.2024).xlsx` — respondent-level records with boarding/alighting station —
  and a standard PII-stripping script (`Remove_LatLong.py`, covering "Caltrain
  2024") that produces de-identified extracts with TAZ/tract geography for
  fulfilling partner/researcher requests via a protected Box share.
- Dead ends: data.bayareametro.gov (Socrata) and opendata.mtc.ca.gov (ArcGIS
  Hub) have no survey microdata or Caltrain O-D datasets; the 2023–24 Snapshot
  Survey (which did include Caltrain) publishes only a Tableau dashboard and
  PDFs.

**Next step:** email Flavia Tsang requesting the station-level 2024 Caltrain
O&D matrix (or the de-identified microdata). Precedent exists for fulfillment.

## Q4b — Portal/DTX documents and Business Plan appendices

**Status: answered — no per-train data newer than 2019 exists in project
filings; a few useful peak-hour anchors do.**

Per-train load tables:
- The only genuine per-train tables in any filing are Caltrain's own Annual
  Passenger Count Key Findings reports (already known; e.g. 2019:
  caltrain.com/media/1359/download — Tables 11–12 "Fullest Trains" give train
  number, departure time, max-load station, max load, seats, % capacity; e.g.
  NB 217 at 989 riders = 130% of 760 seats leaving Hillsdale).
- SPUR Caltrain Corridor Vision Plan, Appendix A (Feb 2017,
  spur.org/…/Appendix_A_Existing_Conditions_and_Methodology.pdf) has an AM-peak
  northbound **per-train load chart** (~2015–16 data, chart images only) plus
  period-level capacity use (AM peak NB 6,570 riders / 9,100 seats = 72%;
  PM peak 8,816 / 9,750 = 90%).

Peak-hour anchors (line-level, useful as model constraints, all pre-COVID):
- PCEP FTA Core Capacity profiles (FY18 & AR22): 5 peak-hour peak-direction
  trains, 3,403 seats, **96% seated-load factor** (~2016 counts); post-project
  6 trains / 3,768 seats.
- Caltrain Business Plan Corridor Booklet (May 2019, caltrain.com/media/11159):
  "~3,900 riders per direction during its busiest hour" today; 2040 scenarios
  6,400 / 7,500 / 11,000+ pphpd. Business Plan crowding results were published
  only as summary matrices with a 135%-of-seats crowd constraint — no
  train-level appendix exists.
- DTX 2004 FEIS/EIR Ch. 3 (tjpa.org/media/30695/download): PM peak-hour
  outbound max-load-point 1,900 riders vs 2,900 capacity (July 2001) — history
  only.

Dead ends: The Portal's modern FTA CIG profiles (FY25/FY26) report only daily/
annual linked trips (16,500 daily in 2023; 48,000 in 2045); its detailed
"Travel Forecast Results Report" is an unpublished FTA submittal; the DTX
SEIS/EIR (2015/2018) has only combined-operator screenline utilization; the
underlying 2005 Cambridge Systematics ridership analysis is cited but not
posted; PCEP EIR Appendix I (ridership tech memo) is station-level, not
per-train.

**Implication for the model:** project filings add no post-electrification
per-train observations. Their value is as constraints: the 96% pre-COVID
seated-load factor and the 135% crowd cap corroborate capacity assumptions,
and the Fullest Trains tables give known 2019 peaks to check the prior
against.

## Bonus — Cal-ITP GTFS-RT stop metrics

**Status: answered — Caltrain is not on the site; mostly a dead end.**

- The working URL is https://analysis.dds.dot.ca.gov/rt_stop_metrics/ (the
  `rt_trip_updates_stop_metrics` path serves a GCS 404 error page). Its page
  manifest lists 93 trip-update feeds; **no Caltrain** (and no BART — the two
  big Bay Area rail operators are simply not covered, while ~20 other "Bay
  Area 511" feeds and other rail like ACE/Capitol Corridor/SMART are).
- Even for included feeds the site is monthly aggregates per stop per
  route-direction (prediction accuracy/completeness metrics), not per-trip
  times, with no public raw-data download — so it wouldn't have served the
  dwell-proxy purpose anyway.
- Upstream, Cal-ITP *does* ingest "Bay Area 511 Caltrain TripUpdates /
  VehiclePositions" into its warehouse (monthly TU/VP coverage for Caltrain is
  ~90–100%, verifiable in the public GTFS Digest file
  `https://storage.googleapis.com/calitp-publish-data-analysis/gtfs_digest/fct_monthly_operator_summary_2026_06.csv`).
  The trip-level RT stop-time data lives in their BigQuery warehouse
  (`cal-itp-data-infra`, `mart_gtfs` dbt models) — access required, not public.
  If a historical arrival/departure archive is ever needed, asking Cal-ITP for
  warehouse access is the route; otherwise, self-archiving the live SIRI feed
  (which carries aimed+expected arrival *and* departure) remains the dwell
  source.

## Files in this directory

- `data/nb_tidy_{2016..2019}.csv` — per-train, per-station On/Off/OnBoard,
  northbound weekday, from the Annual Passenger Count workbooks
- `data/nb_share_by_train_2016_2019.csv` — each common train's share of NB
  daily boardings by year (46 trains)
- `data/caltrain_daily_origin_station.csv` — daily ridership estimates,
  systemwide 2016→, by origin station 2022-06→, through 2026-07-31
- `data/caltrain_daily_fare_media.csv` — daily ridership by fare
  channel/product/type, 2023-11→2026-07
- `analysis/parse_annual_counts.py`, `analysis/extract_tableau_extracts.py`
