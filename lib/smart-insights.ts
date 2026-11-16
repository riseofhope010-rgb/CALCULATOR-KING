// Smart Insights tips — honest, factual tips per calculator, shown with the
// visitor's own computed numbers. No AI model is involved, so the section is
// called "Smart Insights", not "AI Insights". Shared by the role-page
// calculator (GenericCalculatorDynamic) and the hub template.
export const SMART_TIPS: Record<string, string[]> = {
  salary: [
    'Your take-home pay is what matters, not the gross number — compare job offers on net monthly pay.',
    'A 401(k) contribution lowers taxable income today and grows tax-deferred.',
  ],
  tax: [
    'The standard deduction is often worth more than itemizing, unless you have large mortgage interest or donations.',
    'Tax credits reduce your bill dollar-for-dollar; deductions only reduce taxable income.',
  ],
  mortgage: [
    'A 1% lower rate can save tens of thousands over a 30-year loan.',
    'Paying a little extra principal each month shortens the loan and cuts total interest.',
  ],
  investment: [
    'Time in the market beats timing the market — compounding rewards early, regular contributions.',
    'Check the inflation-adjusted value: nominal gains can hide real losses.',
  ],
  loan: [
    'Shorter terms mean higher monthly payments but much less total interest.',
    'Making one extra payment a year can cut years off a loan.',
  ],
  retirement: [
    'The 4% rule is a rule of thumb — your real safe withdrawal depends on market returns and lifespan.',
    'Increasing contributions early matters more than increasing them late, thanks to compounding.',
  ],
  'compound-interest': [
    'Compounding frequency matters: daily beats monthly, monthly beats annually — but the rate matters most.',
    'Regular contributions often add more than the interest itself over long periods.',
  ],
  currency: [
    'Exchange rates move daily — the rate shown is approximate, check a live rate before a large transfer.',
    'Banks and transfer services add their own spread on top of the mid-market rate.',
  ],
  bmi: [
    'BMI is a screening tool, not a diagnosis — muscle mass can push it up without extra fat.',
    'Waist size and activity level matter as much as the BMI number.',
  ],
  calorie: [
    'A 500-calorie daily deficit is roughly 1 lb (0.45 kg) per week.',
    'Protein keeps you full — aim for protein at every meal when cutting calories.',
  ],
  'freelance-rate': [
    'Your rate must cover taxes, expenses, and unpaid time — the gross hourly rate is not your pay.',
    'Raising your rate 10% and losing 10% of clients still earns you more.',
  ],
  roi: [
    'Compare annualized ROI (CAGR), not total ROI, when investments ran for different lengths.',
    'A 50% return over 10 years is only about 4% a year — below the stock market average.',
  ],
  'affiliate-commission': [
    'Revenue per visitor matters more than raw traffic — a small, targeted audience can out-earn a big one.',
    'Test different products and commission rates; a 2% conversion at 5% commission beats 5% conversion at 1%.',
  ],
  'cost-of-living': [
    'Housing is usually the biggest cost difference between cities — compare rent first.',
    'A higher salary in an expensive city can mean less money left over than a lower salary somewhere cheaper.',
  ],
  crypto: [
    'Crypto gains are taxed — long-term holdings (over a year) usually get a lower rate than short-term trades.',
    'Never invest money you need within a year; crypto can drop 50% or more in weeks.',
  ],
  'loan-emi': [
    'A longer tenure lowers the EMI but raises total interest sharply — check the total before signing.',
    'Prepaying part of the principal early saves the most interest.',
  ],
  forex: [
    'Leverage magnifies losses as fast as gains — a 1% move against you at 1:100 wipes the margin.',
    'Always know your pip value before opening a trade.',
  ],
  'contractor-income': [
    'Set aside 25–30% of every payment for taxes — self-employment tax is on top of income tax.',
    'A W-2 job’s benefits (health, retirement, paid leave) are worth roughly 25–30% of salary — compare total packages, not just pay.',
  ],
  pension: [
    'Each extra year of service raises your pension — check whether working one more year is worth more than retiring now.',
    'A lump sum looks big, but a monthly pension pays for as long as you live.',
  ],
  'profit-margin': [
    'Net margin is the number that matters — gross margin can look great while the business loses money.',
    'A 1% price rise often adds more profit than a 5% cost cut.',
  ],
}
