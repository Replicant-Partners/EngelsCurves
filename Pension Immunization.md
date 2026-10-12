# Pension immunization

Interest rates, long-dated liabilities and asset allocation

1. [aAssumptions](#supuestos)
2. [iFunded status](#fondeo)
3. [iiDiscounting](#mecanica)
4. [iiiBonds versus equities](#bonos)
5. [ivAllocation](#asignacion)
6. [vMarkets](#mercado)

A pension fund has fairly predictable future obligations, namely the payments it will have to make to its retirees over several decades. To know what those obligations are worth today, it discounts them at an interest rate. When rates rise, the present value of those liabilities falls, and when rates fall, it rises. Immunization means building a bond portfolio whose duration (the sensitivity of its price to changes in rates) matches the duration of the liabilities. That way, when rates move, assets and liabilities change in value by the same proportion and the fund's net position stays protected. Today the industry calls this strategy *liability-driven investing* (LDI).1

1The idea was formalized by the British actuary Frank Redington in 1952. His three conditions are that the present value of assets equals that of liabilities, that their durations match, and that the convexity of assets exceeds that of liabilities.

## aAssumptions

Every assumption is set with the sliders in this table, and each chart recalculates instantly. The sliders that affect each chart are repeated below it, so you can move them and see the change without scrolling back up. The example plan must pay 1 million a year for 30 years and is 100% funded at a 5% discount rate.2

2The preset market rates, CAPE and inflation are illustrative, not current market data. They should be replaced with live figures from FRED, Bloomberg or the Milliman Pension Funding Index. Your browser remembers the values you choose.

| Assumption | Value | Used in |
| --- | --- | --- |
| Discount rate |  | Moves the marker in i and the red row in ii |
| Liability hedge ratio |  | Share of liabilities immunized, with the rest in short-term bonds, in i |
| 30-year Treasury |  | Reference in i and iii |
| AA corporate |  | US pension discount rate and bond return in iii and iv |
| Shiller CAPE |  | Expected equity return in iii and iv |
| Expected inflation |  | Converts the real equity return to nominal |
| Actuarial target |  | Return the fund needs, in iii and iv |
| De-risking trigger |  | Funded level that triggers the shift to bonds, in i |

## iFunded status versus the discount rate

A fully hedged plan combines a 5-year and a 25-year zero-coupon bond so that it matches the duration of the liabilities, and its funded status barely moves across the whole range. An unhedged plan, with everything in 2-year bonds, gains when rates rise and loses heavily when they fall. The red curve is your plan, which blends the two according to the chosen hedge ratio, so the more it is hedged, the flatter it becomes. The dotted line is the de-risking trigger, the funded level at which a plan typically moves equities into long-duration bonds to lock in the gain.

The grey vertical lines mark the reference rates from the assumptions table. The red dot marks your plan's funded status at the chosen discount rate.

**reading**–

## iiThe mechanics of discounting

Modified duration estimates how much the present value of the liabilities changes for each point the rate moves. The table compares that estimate with the exact value. The gap between them is convexity, which makes liabilities rise more when rates fall than they drop when rates rise.

Values in millions. The red row is the chosen discount rate.

| Scenario | Rate | PV of liabilities | Exact change | Duration estimate |
| --- | --- | --- | --- | --- |

**reading**At the chosen rate, the Macaulay duration of these liabilities is – years and the modified duration is –, so a one-point move in rates shifts the liabilities by roughly –.

## iiiBonds versus equities

The argument is that when bonds pay close to the actuarial target and equities are expensive, the premium for taking equity risk becomes very thin. The chart compares bond yields with the expected return on equities, and the red vertical line marks the actuarial target.3

3The expected equity return is approximated as 100 divided by the Shiller CAPE plus expected inflation. It is a simple rule that ignores growth and multiple changes, but historically it has been a reasonable indicator of ten-year returns.

**reading**–

## ivHow much equity does the fund need?

With a portfolio of AA bonds and equities, the minimum equity weight needed to reach the target is (target − bonds) ÷ (equities − bonds). The chart shows that relationship for several equity return assumptions, and the red curve is the one from the table.

The curves stop at 100% because beyond that point the fund would need leverage. Once bond yields reach the target, the required weight drops to zero regardless of the equity assumption.

**reading**–

## vWhat it means for markets

Pension funds are among the largest LPs in the world, so a change in their allocation moves very significant capital flows. If they rebalance toward fixed income, demand for long-duration bonds rises, which tends to push their yields down and flatten the long end of the curve. At the same time, equity selling weighs on valuations, and alternative assets such as private equity and VC compete for a smaller slice of the portfolio, since their appeal was precisely to deliver returns above the actuarial target when bonds fell short. For a fund like Axolotl, this means a tougher fundraising environment and LPs who measure every proposal against what they can now earn in bonds with almost no risk.