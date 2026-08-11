# Round 3 findings

Continues `FINDINGS.md` / `FINDINGS-2.md`. Date: 2026-08-11. Standing rule
unchanged: public, instantly-fetchable data only.

## 1. Fall 2025 Triennial survey — YES, a post-electrification time-of-day
distribution exists (coarse but decisive)

The Triennial Customer Survey Summary Report (Corey, Canapary & Galanis;
fieldwork Oct 9 – Nov 13 2025; 3,622 completes; caltrain.com/media/37005)
publishes, in the weighting section (p. 7) — the same place Table 9 hid in
the O&D report — a stratum table sourced from **"Caltrain's 2025 Station
Ridership Count for the months of September, October and November 2025"**:

| Stratum | Avg weekly ridership | share of weekday week |
|---|---|---|
| AM Peak | 59,370 | 30.0% |
| PM Peak | 77,185 | 39.0% |
| Off-Peak | 61,350 | 31.0% |
| Saturday | 22,883 | — |
| Sunday | 16,846 | — |
| TOTAL | 237,634 | |

Digitized to `data/triennial2025_weekly_ridership_by_stratum.csv` (checksum
matches the printed 237,634). Implied AWR = 197,905 / 5 = **39,581**, which
matches the Tableau series for Sept–Nov 2025 (~40–41k) — strong cross-check.

**Impact on the model's largest known bias — mostly retired.** Mapping the
Jan-2023 frame onto the same three buckets (AM = 6:00–8:59, PM = 15:00–18:59,
off-peak = early AM + midday + evening):

| Weekday share | Jan 2023 frame | Fall 2025 count |
|---|---|---|
| AM peak | 29.9% | 30.0% |
| PM peak | 36.4% | 39.0% |
| Off-peak | 33.7% | 31.0% |

The feared post-electrification drift toward midday/evening **did not
materialize at this resolution** — the shift is ~2–3 points *toward PM peak*.
So the Jan-2023 frame's period-level distribution was approximately right;
the model should rescale the Jan-2023 cells so the three-bucket totals match
Fall 2025 (small correction), keeping Jan-2023's direction and service-type
splits within buckets.

Caveats:
- The report never defines the peak-hour boundaries; they belong to the
  cited count. Assumed to match the O&D-survey definitions pending the
  companion documents.
- Strata are direction-blind and service-type-blind — Jan-2023 remains the
  only public source for those splits.
- "Caltrain's 2025 Station Ridership Count" (Sept–Nov 2025) is itself a
  previously-unknown data product — likely the APC system in early use. If
  it is ever published in full it supersedes everything here; watch the
  FY2026 annual report (due ~Sept 2026).
- The survey's own boarding-station table (p. 24) gives 2025 weekday
  peak/off-peak/weekend splits by station in percent — a secondary public
  time-split spatial signal (2,129 peak / 935 off-peak completes).

## 2. Jan-2023 vintage bias — largely resolved by item 1

The three-bucket rescale above absorbs the level shift. Remaining exposure is
within-bucket: early-AM/midday/evening composition of "off-peak," and
direction splits, still Jan-2023-vintage. The planned GTFS 2023-vs-current
trips-by-period comparison is now a second-order refinement scoped to those
sub-splits. (GTFS archive sourcing in progress; will be added here.)

## 3. Max-load link — computed; the hand count moves to San Mateo

From `nb_tidy_2019.csv`, per-train load profiles (onboard = load departing
each station), 17 AM-peak NB trains:

- The max-load link is **not uniform**; it clusters by stopping pattern:
  Hillsdale→Hayward Park 6/17 (incl. the fullest trains 217/227/313/323),
  Burlingame→Millbrae 4/17, San Bruno→SSF 2/17 (215/225), Sunnyvale→Mountain
  View 2/17 (bullets 319/329, which fill in the South Bay), others 3/17.
- Best single observation point: **load departing San Mateo** (San
  Mateo→Burlingame link) captures a mean **92.8%** of each train's true max
  (min 83.6%, 8/17 trains at 100%). Hillsdale departure: mean 86.9%, min
  68.0%. The prior guess (Hillsdale→San Mateo) was one station south of
  optimal.
- Corridor-level: the load plateau runs Redwood City→Millbrae; anywhere in it
  sees ≥75% of max on average, but San Mateo is the argmax.

**Hand-count spec (standing item, still unscheduled):** one weekday morning
at San Mateo, northbound platform, counting load departing on one bullet, one
limited, one local; 2019 reference peaks there ranged ~90–990. Schedule once
a draft model exists.

## 4. Dwell proxy — feasibility test in progress; kill criteria set

Established tonight (2026-08-11 late evening, 5 trains live then end of
service):

- Caltrain's VP feed carries **lat/lon + timestamp only** — no speed, no
  bearing, no `current_status`, no `stop_id`, no `stop_sequence`. Dwell
  detection therefore rests entirely on position-stationarity sampling.
- All vehicles in a snapshot share one vehicle timestamp → single upstream
  refresh cycle; the decisive unknown is that cycle's cadence.
- Rate limit: a 10-request burst in 20s drew zero 429s — the nominal 60/hr
  limit is not hard-enforced at test scale, so 15s polling is at least
  attemptable.

An unattended collector is polling VehiclePositions through the Aug 12 AM
peak (15s cadence 12:30–16:15 UTC), logging per-poll vehicle positions.
Analysis will measure: (a) distinct-vehicle-timestamp cadence, (b)
stopped-time distributions at San Mateo / Hillsdale / Palo Alto coordinates,
(c) whether heavy stops separate from light ones against 30–45s dwells.

**Pre-committed decision rule:** if the upstream refresh cadence is coarser
than ~20s, or stopped-time at stations does not statistically separate
known-heavy from known-light stops, the dwell proxy is **killed** and
validation rests on capacity bounds + the hand count. (Results to be
appended below.)

## Artifacts this round

- `data/triennial2025_weekly_ridership_by_stratum.csv` — p. 7 stratum table
- (pending) AM-peak VP collection analysis
