# CPD Officer Complaint Data — Burge & Guevara Crews + Full CPD Ranking

Chart-ready CSVs derived from the Citizens Police Data Project (CPDP) covering **all 26,643 CPD officers with at least one misconduct complaint**, with the Burge and Guevara crew members flagged. Generated May 2026.

## Files

| File | Rows | Purpose |
|---|---|---|
| **`all_officers_ranked.csv`** | 26,643 | **The master ranked dataset.** Every CPD officer with at least one complaint, sorted by complaint count, with Burge/Guevara crew membership flagged in `flag_burge` and `flag_guevara` columns. This is what drives the headline "where do they rank" charts. |
| `top500_officers.csv` | 500 | Top 500 most-complained-against officers. Web-manageable subset for embedded tables. |
| `officers.csv` | 31 | Burge/Guevara crew only — one row per known target officer with full unit history and role notes. |
| `complaints.csv` | 275 | Every individual complaint against named crew members. For drill-down charts. |
| `summary_stats.csv` | 3 | Burge crew vs. Guevara crew vs. CPD baseline aggregates. |
| `complaint_categories.csv` | 96 | Counts of complaints by category, split by crew. |
| `complaints_by_year.csv` | 54 | Complaint counts by incident year, split by crew. |
| `complaint_bands.csv` | 7 | Officer-volume bands (1-5, 6-10, ..., 100+ complaints) showing how discipline rates decline as complaint counts rise. |

## Source

All data originates from CPD / COPA / IPRA / OPS records released via *Kalven v. City of Chicago* (2014) and subsequent FOIAs and litigation by the Invisible Institute, Loevy & Loevy, People's Law Office, and UChicago Mandel Legal Aid Clinic. Underlying raw data is published in [`invinst/chicago-police-data`](https://github.com/invinst/chicago-police-data). This deliverable is a filtered and aggregated subset.

## Headline findings from this data

### 1. The Burge and Guevara crew members do *not* rank near the top of the full CPD complaint list

The 25 most-complained-against officers in CPD's history (from the CPDP-covered period, ~2000–2016) are not Burge or Guevara people. The top of the list is dominated by officers from other scandals — notably **Jerome Finnigan** (162 complaints), leader of the disgraced Special Operations Section who was convicted in 2011 of ordering a hit on a fellow officer, and **Glenn Evans** (131 complaints), the officer charged in 2013 with shoving his gun in a suspect's mouth.

The highest-ranked named crew members are:
- **Anthony Wojcik** (Guevara crew) — rank #349 with 49 complaints
- **Peter Dignan** (Burge "Midnight Crew") — rank #1,640 with 29 complaints
- **Reynaldo Guevara himself** — rank #2,603 with 23 complaints
- **Jon Burge** — rank #13,589 with only 6 complaints

### 2. Why Burge looks so low: the data is censored

CPDP's complaint records are substantially complete only from 2000 forward. Burge was fired in 1993. **His pre-2000 complaint history was either never digitized, was destroyed under CPD's 5-year retention rule (which the Kalven case fought against), or was lost in pre-electronic recordkeeping.** Over 100 documented torture survivors testified about Burge's conduct, but only 6 of their complaints survive in this dataset. This is a critical context note for any chart involving Burge personally.

### 3. The accountability inversion

Officers with more complaints are *less* likely to be disciplined on each one:

| Complaints per officer | Number of officers | Avg discipline rate |
|---|---|---|
| 1–5 | 12,444 | 12.7% |
| 6–10 | 5,639 | 9.5% |
| 11–20 | 5,173 | 8.2% |
| 21–30 | 1,931 | 7.3% |
| 31–50 | 1,134 | 6.6% |
| 51–100 | 311 | 6.4% |
| 100+ | 11 | 4.3% |

This is one of the strongest patterns in the data. The 11 officers with 100+ complaints accumulated 1,339 complaints between them and were disciplined on roughly 1 in 23. The system gets *more* protective as evidence accumulates against an officer.

## Field reference — `all_officers_ranked.csv`

| Column | Description |
|---|---|
| `rank` | 1 to 26,643, sorted by `n_complaints` desc |
| `display_name` | Title-cased "First Last" |
| `crew` | `Burge`, `Guevara`, or empty |
| `n_complaints` | Total complaints in CPDP |
| `n_sustained` | Complaints with final finding "SU" |
| `n_disciplined` | Complaints where discipline was actually imposed |
| `pct_sustained` | `n_sustained / n_complaints * 100` |
| `pct_disciplined` | `n_disciplined / n_complaints * 100` |
| `n_excessive_force` | Complaints in any "Excessive Force" category |
| `n_civil_rights` | Complaints in any "Civil Rights Violation" category |
| `race`, `gender`, `appointed_date`, `resignation_date`, `birth_year` | From CPD personnel records |
| `UID` | CPDP stable per-officer identifier |
| `officer_id` | CPDP public-facing officer ID (used in the URL) |
| `cpdp_url` | Direct link to the officer's public profile |
| `flag_burge`, `flag_guevara` | Boolean: is this officer in the named crew list? |

## Caveats — read before charting

1. **The named crew list is non-exhaustive.** It contains 24 confirmed officers (16 Burge, 8 Guevara) drawn from People's Law Office records, the Loevy & Loevy Guevara fact sheet, and major journalism. Other detectives named in individual TIRC referrals or in less-publicized civil suits are not flagged. **If a chart implies "this is everyone in the Burge crew," it overstates what the data shows.** A more comprehensive list would require parsing TIRC's full case files and the PLO survivor list line-by-line.

2. **CPDP captures complaints to internal CPD investigative bodies (BIA, OPS → IPRA → COPA).** It does not capture: federal civil suits filed directly in court, TIRC referrals, Cook County Conviction Integrity Unit reviews, or state Court of Claims actions. Some "FEDERAL CIVIL SUIT" entries appear in the complaint category field, but most civil litigation is invisible here.

3. **Pre-2000 records are missing or incomplete.** The CPDP team marks data as "complete 2000 to mid-2016, substantially complete back to 1988, with some records back to 1967." For any officer who retired before ~2000, expect undercount.

4. **One complaint can name multiple officers.** Each officer-complaint pair is one row in the underlying data. A single incident with three accused officers shows up three times across the dataset.

5. **"Disciplined" doesn't mean meaningful punishment.** It means *some* discipline was imposed, which could be a 1-day suspension, a written reprimand, or termination. The CPDP raw data has more granular outcome fields if you need that distinction.

## How to use this with Google Sheets

1. Upload `all_officers_ranked.csv` to Google Drive.
2. Right-click → Open with → Google Sheets.
3. For the website, use Google Sheets' "Publish to web → CSV" to get a stable URL you can embed in chart tools (Datawrapper, Flourish, custom Chart.js).
4. For an on-website "look up any officer" feature, the 3.3 MB ranked file is small enough to ship as a static asset and filter client-side.

## Citation block for the website

> Source: Citizens Police Data Project (Invisible Institute), drawing on Chicago Police Department complaint records released to the public under *Kalven v. City of Chicago* (2014). Raw data: github.com/invinst/chicago-police-data. Burge and Guevara crew flagging compiled May 2026 from People's Law Office and Loevy & Loevy case records. Coverage is substantially complete only from 2000 forward; earlier records — including most of the Burge era — are missing.

## Regeneration

See `regenerate.py`. Re-run whenever CPDP refreshes the underlying data.
