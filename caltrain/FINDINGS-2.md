# Round 2 findings — gating questions for the assignment model

Continues `FINDINGS.md`. Date: 2026-08-11.

## 1. Time dimension in the MTC 2024 O-D microdata

(pending — agent research + see `mtc_email_draft.md` for the request letter)

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
