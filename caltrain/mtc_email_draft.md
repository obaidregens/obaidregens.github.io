# Draft email to MTC (do not send from this repo — copy into your mail client)

**To:** Flavia Tsang <ftsang@bayareametro.gov>
**Subject:** Data request: 2024 Caltrain O&D survey — station-level records with time of day

Hi Flavia,

I'm working on an independent analysis of Caltrain ridership patterns —
specifically, estimating typical passenger loads on individual weekday trains,
which Caltrain no longer publishes since the annual passenger counts were
discontinued.

The published 2024 Caltrain Origin & Destination Customer Survey report (RSG,
January 2025) presents boarding-to-alighting flows aggregated to nine zone
groups, and notes (§2.6) that the underlying data were delivered at the
boarding/alighting-station level. Table 4 of the report shows that each
record also captured "Train number (recorded)" and "Time of day (recorded)",
and §3.5 describes weighting by Time Period × Service Type × Direction — so
the time dimension I need exists on the delivered file. The Transit Passenger
Survey program's data page indicates data summaries and microdata are
available on request, so I'm hoping you can help with the following, in order
of preference:

1. A de-identified respondent-level extract of the 2024 Caltrain O&D survey
   (I believe the deliverable is "2024 Caltrain OD Data (sent 11.7.2024)")
   containing, per record: boarding station, alighting station, **recorded
   train number and/or time period**, service type, direction,
   weekday/weekend flag, and the expansion weights (e.g.
   weekday_expanded_weight / week_weight), plus the Data Dictionary sheet.
   The On-to-Off dataset (5,521 records) with the same fields would be just
   as valuable. Home/work/origin/destination locations and any other PII are
   not needed — a PII-stripped extract (as I understand you provide for
   partner requests) is entirely fine, and all lat/lon and TAZ/tract fields
   can be dropped.

2. If respondent-level data isn't possible: a weighted station-to-station O-D
   matrix split by time period (early AM / AM peak / midday / PM peak /
   evening, as defined in the report) or by train, for weekdays.

3. If neither is possible: the weighted station-to-station matrix without the
   time dimension.

The time-of-day element is the critical piece for my purposes — station pairs
alone I can approximate from published sources, but nothing public captures
how Caltrain demand distributes across the service day post-electrification.

I'm happy to sign a data use agreement if required, and glad to share the
resulting analysis back with you and Caltrain staff.

Thanks very much,
[name]
[affiliation / a sentence on the project]
