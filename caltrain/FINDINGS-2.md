# Round 2 findings — gating questions for the assignment model

Continues `FINDINGS.md`. Date: 2026-08-11.

## Ground rule adopted mid-round: no request-gated data

Anything that requires human approval on the other end — the MTC microdata
extract, Cal-ITP warehouse access, future asks to Caltrain staff — is **out of
scope**. The model is built from public, instantly-fetchable sources only.
`mtc_email_draft.md` is retained in case that ever changes, but nothing
depends on it. Consequences are folded into items 1 and 2 below; the headline
is that the 2024 O&D report itself publishes enough (Table 9 sampling frame +
Table 3 zone matrix) to substitute for the microdata at reduced granularity,
and a self-run SIRI archiver (needs only the existing 511 key) substitutes
for the warehouse going forward.

### The public time-of-day anchor (replaces the microdata ask)

Table 9 of the O&D report (p. 20) prints the survey's sampling frame:
**average weekday boardings by direction × time period × service type,
January 2023** — the only published post-COVID time-of-day distribution of
Caltrain ridership. Digitized to
`data/od2024_table9_jan2023_frame.csv` (checksums match the printed totals:
NB 8,269 / all 16,491).

It directly measures the peak flattening that was this round's central risk
(2019 figures from the Key Findings report's market table, which counts early
AM within peak):

| Share of weekday boardings | 2019 census | Jan 2023 frame |
|---|---|---|
| Peak (incl. early AM) | 84.6% | 72.5% |
| Midday | 11.0% | 19.5% |
| Evening | 4.4% | 8.0% |

Northbound Jan 2023: Early AM 10.9%, AM peak 32.6%, Midday 19.6%, PM peak
31.1%, Evening 5.8%.

Caveats: the frame's absolute total (16,491) runs ~11% above the Tableau
Jan-2023 Mon–Thu AWR (14,822) — it's a frame, likely from a specific count
week, so **use its shares, never its levels**; it's Mon–Thu, pre-electrification
schedule (Jan 2023 service types), and now 3.5 years old. But as a
period-level reweighting of the 2019 within-period shape it's exactly the
right correction: apply 2019 shapes *within* each time-period × service-type
cell, and the Jan-2023 (or newer, if ever published) distribution *across*
cells.

## 1. Time dimension in the MTC 2024 O-D microdata — route closed; public substitute above

**Answered: YES — every record carries the surveyed train's number, and time
period is a weighting dimension.** This upgrades the microdata request from
"spatial improvement" to potentially **direct per-train station-pair flows**
for surveyed trains.

Evidence (RSG report, caltrain.com/media/34860):

- Table 4 (p. 13) lists "Train number (recorded)" and "Time of day
  (recorded)" as captured fields — recorded by surveyors, not asked of
  riders. (There is no respondent-reported departure-time question; time
  comes entirely from the recorded train.)
- On-to-Off component (5,521 completes): "Each response also captured the
  train number allowing for time of day and service type to be associated
  with the record" (§2.1); surveyors entered the train number once per
  boarding (§2.3). Even postcard/online O-D responses are train-linked via
  tracked password ranges (p. 14).
- Weighting (§3.5, pp. 21–22) was done in cells of boarding/alighting zone ×
  Service Type (L1, L3, L4, L5, B7) × **Time Period (early AM, AM peak,
  midday, PM peak, evening)** × Direction — impossible unless each record has
  a time period. Period definitions: early AM <6:00, AM peak 6:00–8:59,
  midday 9:00–14:59, PM peak 15:00–18:59, evening 19:00+ (pp. 7, 15).
- Known field names in the delivered workbook ("2024 Caltrain OD Data (sent
  11.7.2024).xlsx", sheets Data / Data with Labels / Data Dictionary), from
  MTC's processing code: `train_dow`, `weekday_expanded_weight`,
  `week_weight`, `id`, origin/destination lat/lon. The exact train-number /
  time-period column spellings weren't referenced in any script, but the
  "Data Dictionary" sheet defines them. (MTC's standardized TPS schema uses
  `day_part`, `weekpart`, `depart_hour` etc.; Caltrain 2024 is not yet
  ingested into that standard database.)
- The published report contains completes-counts by Direction × Time Period ×
  Service Type (Tables 1, 9, 10) but no ridership results split by time —
  those tabs only exist in the microdata.

Caveat for model design: surveyed-train coverage is a sample (Tables 9–10
list which trains were surveyed), so per-train flows from the survey will be
noisy for any single train — treat as calibration targets by service type ×
time period, not as a per-train census. The email draft
(`mtc_email_draft.md`) cites Table 4 and §3.5 and asks for train number
explicitly.

**Status under the no-request-gated-data rule: the request path is closed.**
The findings above document that the time dimension exists in the microdata,
but the model proceeds without it, using what the report itself publishes:
the Table 3 zone-group O-D matrix (spatial seed, weighted to May 2024) and
the Table 9 Jan-2023 direction × time-period × service-type frame (temporal
seed) — see "The public time-of-day anchor" at the top of this file. The
draft stays on file in case the constraint ever lifts.

## 2. Cal-ITP warehouse: departures, or arrival-only?

**Empirical half, answered: the feed itself carries both — but predicted
departures are synthetic.** Live pull of `Transit/TripUpdates?agency=CT`
(2026-08-11, 5 trains): 70 of 71 `stop_time_update`s carry **both** arrival
and departure events (the exception is a departure-only first stop). However,
every predicted departure is exactly arrival + 60 seconds, and SIRI
StopMonitoring shows the same fixed +60s offset — Caltrain's prediction
engine pads a constant dwell rather than predicting real dwell.

**Implication:** no single snapshot yields real dwell times, from 511 or from
any archive of it. Real dwells must be inferred from a *polling time series* —
while a train sits at a platform, the expected departure keeps updating; the
last expected departure before the stop drops out of the feed approximates
actual departure (and same for arrival). So the question "warehouse vs
self-archiving" turns on whether Cal-ITP retains every poll of the TripUpdates
feed (they poll ~every 20s) or only latest-per-trip.

**Warehouse half, answered: the warehouse retains everything needed — request
access instead of self-archiving.**

- `mart_gtfs.fct_stop_time_updates` (BigQuery, project `cal-itp-data-infra`)
  keeps one row per stop_time_update **per 20-second scrape tick**
  (`_extract_ts` at :00/:20/:40), with `arrival_time/delay/uncertainty` AND
  `departure_time/delay/uncertainty`, trip/stop identifiers, and
  `service_date`. The model SQL explicitly parses both StopTimeEvents; the
  staging layer keeps the raw array untouched. No arrival-only limitation.
- History: `GTFS_RT_START = 2022-09-15` — **~4 years of Caltrain tick-level
  prediction history already exists**, spanning pre/post electrification.
  Dataset name: `Bay Area 511 Caltrain TripUpdates`. (Models are views over
  hive-partitioned external tables — queries must filter on `dt` to be
  affordable.)
- Convenience models (`fct_trip_updates_stop_metrics`,
  `fct_trip_updates_trip_summaries`, `fct_observed_trips`) don't provide
  actual arrival+departure directly; dwell inference works from the tick
  series in `fct_stop_time_updates` (last-prediction-before-dropout, exactly
  the derivation a self-archive would need — but retroactive to 2022).
- Because Caltrain's *predicted* departures are synthetic (+60s), the
  derivation should use prediction-sliding: while a train dwells past its
  predicted departure, the prediction keeps advancing tick over tick; the
  final tick before the stop drops out bounds the actual departure to ±20s.
- **Access:** no public/anonymous route (data.ca.gov publication is
  schedule-only). IAM on the project via Caltrans DDS technical onboarding;
  for outsiders the realistic path is emailing **hello@calitp.org**
  describing the research — they've granted external analyst access before,
  or can export a bounded extract. The dbt docs are public, so the ask can be
  precise: `fct_stop_time_updates` where `gtfs_dataset_name = 'Bay Area 511
  Caltrain TripUpdates'`, bounded dates.

**Decision (revised under the no-request-gated-data rule): self-archive.**
Warehouse access requires a human-approved grant, so it's out. The
warehouse findings above stand as documentation of what exists, but the
operative path is a lightweight SIRI StopMonitoring/VehicleMonitoring
archiver using the existing 511 key (instant, no approval): poll every
~30–60s during service hours, keep expected arrival/departure per
train-stop, derive actuals by last-prediction-before-dropout. It only
yields data going forward, so it should start before the model needs it —
validation can use whatever window has accumulated by then.

## 3. Ridership lineage for scaling: use the Tableau series

**Answered: the apparent ~5% conflict was a period mismatch; lineages agree
within ~1–2% on aligned windows. Use the Tableau (fare-model) lineage
throughout; NTD as an external cross-check only.**

| Measure | Window | AWR |
|---|---|---|
| Tableau daily series | CY2019 (Jan–Dec 2019) | 67,506 |
| Tableau daily series | FY2019 (Jul 2018–Jun 2019) | 63,029 |
| FTA NTD 2019 profile | FY2019 | 64,492 |
| Tableau daily series | Feb 2019 (count month) | 64,041 |
| 2019 Annual Count census (NB+SB, Tue–Thu) | Feb 2019 | 63,597 |

- Tableau FY2019 vs NTD FY2019: −2.3%. Tableau Feb 2019 vs the Feb 2019
  census: **+0.7%**. Ridership was rising through 2019, which is the entire
  CY-vs-FY gap.
- The decisive practical point: only the Tableau lineage has daily,
  station-level granularity and continuous history spanning the count era to
  today. And since the Tableau series matches the census within 0.7% in the
  very month the shape prior was counted, scaling the census shape by
  (Tableau current period ÷ Tableau Feb 2019) keeps everything in one lineage
  with no cross-methodology splice.
- Convention: state all model outputs as "estimated boardings, Caltrain
  fare-model lineage" and quote NTD only in validation appendices.

## 4. GoPass distortion

**Answered — and the premise was wrong in a helpful way: the "37
trips/month" constant is the MONTHLY PASS assumption, not GoPass. GoPass is
mostly tap-data-driven, so its origin-station attribution is largely
observed, not assumed.**

Methodology (FY2024 report caltrain.com/media/34265 Table 1 p.7; FY2025
report caltrain.com/media/35885 Table 1 p.6; CAC "Fare Media Sales-Based
Ridership Model" deck Dec 20 2023, caltrain.com/media/32376/download,
Appendices A–B):

- **Clipper GoPass** (13.7% of FY2025 trips): trips, days, and origin
  stations come **directly from Clipper tap data** — no constant involved.
- **Sticker GoPass** (3.9% of FY2025 trips, was 7.6% FY2024, being phased
  out with Clipper 2.0): each sticker assumed to generate the same monthly
  trips as the average utilized Clipper GoPass **that month** (a dynamic
  ratio), distributed to stations by GoPass-survey responses weighted by trip
  frequency, and across days by that month's Clipper GoPass daily pattern.
- **Monthly Pass** is the assumption-heavy category: flat 26 trips/pass/month
  through Dec 2024, **revised to 37 in January 2025** based on the 2024 O&D
  survey; distributed to stations by that month's Clipper tags, across days
  at 2022 Clipper GoPass rates. One-Way = 1 trip/ticket; Day Pass = 2.

Revised distortion envelope: the truly assumption-driven slice is Monthly
Pass (~20%) + Sticker GoPass (~4%) ≈ **24%** of estimated riders — not the
~36% feared — and the biggest single risk is the flat 37/month Monthly Pass
constant applied uniformly across stations and days.

**Two consequences for the model:**

1. **The Tableau series has a methodological break at January 2025** (Monthly
   Pass 26→37; the model itself only exists since Nov 2023, conductor-count
   ratios before that). Part of the FY2025 "+47%" is this recalibration, not
   riders. Any cross-break comparison (e.g. scaling factors spanning Jan
   2025) should either use the post-Jan-2025 segment only or adjust
   pre-break Monthly Pass ridership up by 37/26 (~+8.5% on that slice ≈ +1.7%
   systemwide).
2. **The model's days are numbered in the best way**: both annual reports
   state the validated EMU APC system "will take the place of the Fare Media
   Model for reporting purposes," expected during FY2026. When that happens,
   per-train counts exist internally — a records request or a data ask to
   Caltrain staff becomes the endgame for this whole project.

Share numbers (from `data/caltrain_daily_fare_media.csv`, consistent with the
reports' Table 7: GoPass 20.4% FY2024, 17.6% FY2025):

Share of estimated ridership by ticket type (from
`data/caltrain_daily_fare_media.csv`):

- **GoPass: 19.5% (FY2024) → 16.3% (FY2025) → 15.6% (FY2026) → 13.6% (Jul
  2026)** — declining.
- Clipper BayPass (the institutional successor): 0.8% → 1.3% → 2.0% → 2.7% —
  growing, partially offsetting.
- Monthly Pass ~18–21%, One-Way ~53%, Day Pass ~8–14%.
- Combined pass products (GoPass + BayPass + Monthly) ≈ **35–37%** of
  estimated ridership — this is the slice whose daily levels rest on model
  assumptions rather than per-ride transactions, i.e. the distortion
  envelope for origin-station scaling targets.
- The daily GoPass series is *not* flat: 2026 weekday means are Mon 6.4k /
  Tue 8.7k / Wed 8.6k / Thu 8.0k / Fri 5.4k with real day-to-day variance
  (σ 500–1,700), so the model modulates pass ridership by day type/season
  somehow — how (and whether per-station) is the open methodology question.

## 5. Tue–Thu vs Mon/Fri differential

**Answered from the daily Tableau series, electrified era (2024-09-21 →
2026-07-31), weekday day-type only:**

- Systemwide: Tue 41.7k / Wed 40.8k / Thu 39.3k; **Monday = 80.4% of the
  Tue–Thu average, Friday = 78.0%.** Mon–Fri average = 91.8% of Tue–Thu.
  So the mid-week shape prior overstates Mon/Fri by ~20–25% if applied
  unadjusted.
- Station variation is real and systematic. Friday as % of Tue–Thu: Gilroy
  line lowest (Morgan Hill 56%, Gilroy 58%, Tamien 64%), commuter-heavy
  mid-Peninsula low (Hillsdale 64%, Lawrence 70%, 22nd St 71%); most
  resilient are Bayshore/Santa Clara/Burlingame/San Bruno/Menlo Park
  (~88–90%) and Millbrae (86%, BART transfer). SF 76%, Palo Alto 80%.
- Model treatment: estimate per-train ridership for a Tue–Thu day (matching
  the prior), then produce Mon and Fri variants by applying station-level
  day-of-week factors to the origin flows before assignment.

## 6. EMU capacity

**Answered with official numbers: 675 seats, 810 at Caltrain's planning load
factor.**

- **Seated: 675 per 7-car Stadler KISS set** — two official sources agree
  (Caltrain Electric Train FAQ, caltrain.com/electrictrainfaq; **2025 Title
  VI Program**, caltrain.com/media/36677/download: "seated capacity of 675
  seats and can hold 72 bicycles. With peak load factor of 1.2 this equates
  to 810 passengers").
- **Standing:** no official crush figure. Caltrain's planning number is
  **1.2 × seats = 810**. The Stadler spec-sheet crush estimate (AW3, 6
  standees/m²) is >1,400 — engineering limit, not an operating figure. For
  the model: soft cap 810, and note the diesel-era Business Plan used a
  135%-of-seats cap (would be 911) — a reasonable upper band; observed 2019
  peaks hit 130–143% of seats.
- History: original 2016 order was 6-car sets at 573 seats; the seventh car
  (~100-seat trailer, Dec 2018 option) brings 675. 72 bike spaces, 14 seats
  in bike cars. (A 667-seat figure floats in 2019-era secondary coverage;
  675 is the as-delivered official number.)
- Comparison to the prior's era: diesel consists averaged ~680 seats (PCEP:
  3,403 seats / 5 trains), so **seats per train are essentially unchanged**
  (675 vs ~680) — the capacity constant transfers cleanly.

## 7. Consist uniformity

**Answered: uniform 675-seat sets on the electric mainline; the only
exception is the 4-roundtrip diesel Gilroy shuttle.**

- All ~104 weekday mainline (SF–San Jose/Tamien) trains are **fixed 7-car
  EMUs** — Title VI calls them "fixed 7-car" units; the FAQ says "no plans
  for other configurations." No doubled (2×7) or short sets in service.
  Fleet: 19 sets at launch, 23 as the Aug 2023 option delivers.
- **Gilroy service (South County Connector) is diesel and is not a through
  service post-electrification**: 4 weekday roundtrips San Jose
  Diridon–Gilroy with a timed 3-minute cross-platform transfer at Diridon
  (Final Service Plan Fall 2024, caltrain.com/media/32274/download).
  Equipment: MP36PH-3C/F40PH-2C + Bombardier BiLevels, 2–5 cars, **official
  seated range 254–690** (~127–138 seats/car); no published per-train
  consist.
- **Model consequence bigger than capacity:** in the 2019 prior, Gilroy
  trains were *through* trains to SF; today Gilroy riders transfer at
  Diridon and appear on mainline EMUs as Diridon boardings. The assignment
  model should treat the 4 connector trips as a separate stub service
  feeding transfer volumes into specific mainline trains, and use a single
  675-seat / 810-soft-cap constant for every mainline train.

## Standing item — hand count

Still unscheduled. One weekday morning, three northbound trains (suggest one
bullet, one limited, one local through the peak load point Hillsdale→San
Mateo) would give the only fully independent check on the assembled model.

## Artifacts this round

- `mtc_email_draft.md` — request letter to MTC (to be sent by a human)
