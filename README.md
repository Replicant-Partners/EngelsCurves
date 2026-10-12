# Engels Curves

Interactive analysis of pension immunization, interest rates, long-dated liabilities, and asset allocation for a US defined-benefit pension fund.

## Current scope

The base scenario uses:

- **Liabilities:** USD 1,000,000 paid annually for 30 years.
- **Market:** US pension fund.
- **Discounting:** present value, Macaulay duration, modified duration, and convexity.
- **Immunization:** comparison of hedged and unhedged bond portfolios.
- **Allocation:** bond/equity mix required to meet an editable actuarial return target.
- **Views:** latest available data and a historical date selected by the user.

The USD 1 million / 30-year cash-flow schedule is an explicit modeling assumption, not a claim about a particular pension plan.

## Data policy

Observed market data must be captured with its source, series identifier, observation date, frequency, units, and retrieval timestamp. The application should never silently mix observations from different dates.

### Primary sources

| Variable | Source | Series or dataset |
| --- | --- | --- |
| 30-year Treasury yield | Federal Reserve / FRED | [`DGS30`](https://fred.stlouisfed.org/series/DGS30) |
| AA corporate yield | ICE BofA / FRED | [`BAMLC0A2CAAEY`](https://fred.stlouisfed.org/series/BAMLC0A2CAAEY) |
| AA corporate option-adjusted spread | ICE BofA / FRED | [`BAMLC0A2CAA`](https://fred.stlouisfed.org/series/BAMLC0A2CAA) |
| CPI inflation | BLS / FRED | [`CPIAUCSL`](https://fred.stlouisfed.org/series/CPIAUCSL) |
| Expected inflation | US Treasury / FRED | Treasury breakeven series, selected by maturity |
| CAPE and long-run equity data | Robert J. Shiller | [Shiller data](https://shillerdata.com/) |
| Pension funded status and corporate discount rates | Milliman | [Milliman 100 PFI](https://www.milliman.com/en/insight/pension-funding-index) |

The Moody's `BAA` series is Baa-rated credit, not AA, so it should not be used as the AA input without an explicit explanation.

## Modeling assumptions

These inputs remain editable because they are plan-specific rather than directly observable market data:

- actuarial return target;
- liability hedge ratio;
- de-risking trigger;
- equity return methodology;
- historical valuation date;
- payment growth and inflation linkage, if the base cash flows are expanded.

The initial equity-return approximation is:

```text
Expected nominal equity return = 100 / CAPE + expected inflation
```

This is a transparent heuristic, not a forecast or investment recommendation. It does not model earnings growth, changes in valuation multiples, or buybacks.

## Planned visualizations

1. Funded status across discount rates, with hedge-ratio and de-risking controls.
2. Liability present value, exact rate sensitivity, duration estimate, and convexity.
3. Bond yields versus estimated equity returns.
4. Equity weight required to meet the actuarial target.
5. Market implications of pension reallocation toward fixed income.

## Reproducibility requirements

Each displayed value should expose:

- source and direct URL;
- series identifier or dataset name;
- observation date;
- retrieval date;
- frequency and units;
- whether it is an observation or a user-editable assumption.

## Status

- [x] Pension immunization draft added in [`Pension Immunization.md`](./Pension%20Immunization.md).
- [x] Base scenario and data-source policy documented.
- [ ] Choose and record the initial historical valuation date.
- [ ] Implement data ingestion for the listed sources.
- [ ] Implement calculations and interactive charts.
- [ ] Add validation tests for present value, duration, convexity, and allocation formulas.
