# Round 2 findings — gating questions for the assignment model

Continues `FINDINGS.md`. Date: 2026-08-11.

## 1. Time dimension in the MTC 2024 O-D microdata

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

(warehouse schema/retention/access — pending agent research)

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

**Partially answered from the extracted fare-media data (methodology
provenance pending agent research on the FY2024/25 annual reports).**

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

(pending agent research)

## 7. Consist uniformity

(pending agent research)

## Standing item — hand count

Still unscheduled. One weekday morning, three northbound trains (suggest one
bullet, one limited, one local through the peak load point Hillsdale→San
Mateo) would give the only fully independent check on the assembled model.

## Artifacts this round

- `mtc_email_draft.md` — request letter to MTC (to be sent by a human)
