"""Pull Caltrain's ridership Tableau Public workbook and dump its data extracts.

The dashboard (CaltrainTotalRidershipEstimates) has workbook download enabled,
so the packaged workbook — including the .hyper data extracts — is fetchable
without any Tableau UI interaction:

  curl -o wb.twbx https://public.tableau.com/workbooks/CaltrainTotalRidershipEstimates.twb

The zip contains two extracts under Data/:
  sqlproxy.hyper    — daily ridership estimates; systemwide from 2016-01-01,
                      by origin station from 2022-06-01 (cols: Date,
                      Origin Station, Caltrain Day Type, Caltrain Ridership,
                      plus many precomputed dashboard aggregates)
  sqlproxy 1.hyper  — daily ridership by fare media from 2023-11-12 (cols:
                      Date, Fare Distribution Channel, Ticket Type,
                      Product Type, Fare Type, Caltrain Ridership)

Requires: pip install tableauhyperapi
Usage: python extract_tableau_extracts.py <dir containing the .hyper files>
"""
import csv, sys
from tableauhyperapi import HyperProcess, Connection, Telemetry


def dump(conn, query, out, header):
    rows = conn.execute_list_query(query)
    with open(out, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(out, len(rows), 'rows')


def main(d):
    with HyperProcess(telemetry=Telemetry.DO_NOT_SEND_USAGE_DATA_TO_TABLEAU) as hp:
        with Connection(endpoint=hp.endpoint, database=f'{d}/sqlproxy.hyper') as conn:
            dump(conn,
                 'SELECT "Date", "Origin Station", "Caltrain Day Type", "Caltrain Ridership" '
                 'FROM "Extract"."Extract" ORDER BY "Date", "Origin Station"',
                 'caltrain_daily_origin_station.csv',
                 ['date', 'origin_station', 'day_type', 'ridership'])
        with Connection(endpoint=hp.endpoint, database=f'{d}/sqlproxy 1.hyper') as conn:
            dump(conn,
                 'SELECT "Date", "Fare Distribution Channel", "Ticket Type", "Product Type", '
                 '"Fare Type", "Caltrain Ridership" FROM "Extract"."Extract" ORDER BY "Date"',
                 'caltrain_daily_fare_media.csv',
                 ['date', 'channel', 'ticket_type', 'product_type', 'fare_type', 'ridership'])


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
