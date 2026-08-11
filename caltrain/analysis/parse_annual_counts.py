"""Parse Caltrain Annual Passenger Count by-train weekday workbooks (2016-2019)
into tidy per-train per-station on/off/onboard CSVs, and compute per-train
share-of-day stability across years.

Source files (caltrain.com annual reports page):
  2019 https://www.caltrain.com/media/1548/download  (xlsx, sheets NBpaxAMWR/SBpaxAMWR + bike sheets)
  2018 https://www.caltrain.com/media/1546/download  (xlsx, sheets NBPax&Bikes-Hard/SBPax&Bikes-Hard)
  2017 https://www.caltrain.com/media/1556/download  (xls,  sheets NBPax&Bikes/SBPax&Bikes)
  2016 https://www.caltrain.com/media/1558/download  (xls,  sheets NBPax&Bike-Hard/SBPax&Bike-Hard)

Layouts:
  2016-2018: row 0 has "Train NNN" over each train's Off column (On at c-1,
    On Board at c+1); col 0 has station names, passengers block ends at "TOTAL"
    (a bikes block with the same stations follows below it).
  2019: train numbers in row 3 (one per On/Off/On Board column), field names in
    row 4, stations in col 7, rows 5.. until "Total (On/Off)/Max".

Usage: python parse_annual_counts.py <dir with 2016.xls 2017.xls 2018.xlsx 2019.xlsx>
"""
import sys, re
import numpy as np
import pandas as pd


def parse_16_18(path, sheet):
    df = pd.read_excel(path, sheet_name=sheet, header=None)
    trains = {}
    for c in range(df.shape[1]):
        v = df.iloc[0, c]
        if isinstance(v, str) and v.strip().startswith('Train'):
            num = int(re.search(r'\d+', v).group())
            trains[num] = (c - 1, c, c + 1)
    rows = {}
    for r in range(2, df.shape[0]):
        st = df.iloc[r, 0]
        if isinstance(st, str):
            if st.strip().upper() == 'TOTAL':
                break
            rows[st.strip()] = r
    recs = []
    for num, (c_on, c_off, c_ob) in trains.items():
        for st, r in rows.items():
            recs.append(dict(train=num, station=st,
                             on=pd.to_numeric(df.iloc[r, c_on], errors='coerce'),
                             off=pd.to_numeric(df.iloc[r, c_off], errors='coerce'),
                             onboard=pd.to_numeric(df.iloc[r, c_ob], errors='coerce')))
    return pd.DataFrame(recs)


def parse_19(path, sheet):
    df = pd.read_excel(path, sheet_name=sheet, header=None)
    rows = {}
    for r in range(5, df.shape[0]):
        st = df.iloc[r, 7]
        if isinstance(st, str):
            if st.startswith('Total'):
                break
            rows[st.strip()] = r
    trains = {}
    for c in range(8, df.shape[1]):
        tr, typ = df.iloc[3, c], df.iloc[4, c]
        if pd.notna(tr) and isinstance(typ, str) and not isinstance(tr, str):
            trains.setdefault(int(tr), {})[typ.strip()] = c
    recs = []
    for num, cols in trains.items():
        for st, r in rows.items():
            recs.append(dict(train=num, station=st,
                             on=pd.to_numeric(df.iloc[r, cols['On']], errors='coerce'),
                             off=pd.to_numeric(df.iloc[r, cols['Off']], errors='coerce'),
                             onboard=pd.to_numeric(df.iloc[r, cols['On Board']], errors='coerce')))
    return pd.DataFrame(recs)


def main(d):
    data = {2016: parse_16_18(f'{d}/2016.xls', 'NBPax&Bike-Hard'),
            2017: parse_16_18(f'{d}/2017.xls', 'NBPax&Bikes'),
            2018: parse_16_18(f'{d}/2018.xlsx', 'NBPax&Bikes-Hard'),
            2019: parse_19(f'{d}/2019.xlsx', 'NBpaxAMWR')}
    for y, t in data.items():
        t.to_csv(f'nb_tidy_{y}.csv', index=False)
    summ = {y: t.groupby('train').agg(boardings=('on', 'sum'), peak_load=('onboard', 'max'))
            for y, t in data.items()}
    for y in summ:
        summ[y]['share'] = summ[y].boardings / summ[y].boardings.sum()
    common = sorted(set.intersection(*(set(s.index) for s in summ.values())))
    sh = pd.DataFrame({y: summ[y]['share'] for y in summ}).loc[common]
    sh.to_csv('nb_share_by_train_2016_2019.csv')
    for a, b in [(2016, 2017), (2017, 2018), (2018, 2019)]:
        inter = sorted(set(summ[a].index) & set(summ[b].index))
        sa, sb = summ[a].loc[inter, 'share'], summ[b].loc[inter, 'share']
        rel = ((sb - sa) / sa).replace([np.inf, -np.inf], np.nan).dropna()
        print(f"{a}->{b}: r={sa.corr(sb):.4f} rho={sa.corr(sb, method='spearman'):.4f} "
              f"median|dS|/S={rel.abs().median():.3f}")


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
