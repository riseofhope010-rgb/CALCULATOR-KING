'use client'

import React, { useRef, useState } from 'react'
import { Zap, RotateCcw } from 'lucide-react'
import ResultsDisplay from '@/components/shared/ResultsDisplay'
import FavoritesButton from '@/components/shared/FavoritesButton'
import ShareButtons from '@/components/shared/ShareButtons'
import DownloadPDFButton from '@/components/shared/DownloadPDFButton'
import RelatedCalculators from '@/components/shared/RelatedCalculators'
import FAQAccordion from '@/components/shared/FAQAccordion'

// Honest tips, written from the calculator's own numbers — no AI model is
// involved, so the section is called "Smart Insights", not "AI Insights".
const SMART_TIPS: Record<string, string[]> = {
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

interface CalculatorPageProps {
  id: string
  name: string
  description: string
  path: string
  heroContent: string
  calculatorForm: React.ReactNode
  results: {
    mainResult?: { label: string; value: string | number; subtext?: string }
    cards?: { label: string; value: string | number; color?: string }[]
    pieData?: { name: string; value: number; color: string }[]
    barData?: { name: string; value: number; fill?: string }[]
    lineData?: { name: string; value: number }[]
    tableData?: { headers: string[]; rows: (string | number)[][] }
  }
  whatNumbersMean: string
  whyItMatters: string
  howToUse: string[]
  faqItems: { question: string; answer: string }[]
  children?: React.ReactNode
}

export default function CalculatorPageTemplate(props: CalculatorPageProps) {
  const {
    id,
    name,
    heroContent,
    calculatorForm,
    results,
    whatNumbersMean,
    whyItMatters,
    howToUse,
    faqItems,
    path,
    children,
  } = props

  const resultsRef = useRef<HTMLDivElement>(null)
  const [showInsights, setShowInsights] = useState(false)
  const hasResults = results.mainResult || results.cards || results.pieData || results.barData
  const tips = SMART_TIPS[id] ?? ['Compare your result with the benchmark for your situation before deciding.']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Hero/Introduction */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {heroContent}
          </p>
        </section>

        {/* Section 2 & 3: Interactive Calculator and Results */}
        <section ref={resultsRef} className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Enter Your Information
              </h2>
              {calculatorForm}
            </div>

            {/* Results Display */}
            {hasResults && (
              <div className="animate-fade-in">
                <ResultsDisplay title="Your Results" {...results} />
              </div>
            )}
          </div>
        </section>

        {/* Section 4: What Do These Numbers Mean? */}
        <section className="mb-12 card">
          <h2 className="section-title">What Do These Numbers Mean?</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {whatNumbersMean}
          </p>
        </section>

        {/* Section 5: Why This Matters */}
        <section className="mb-12 card">
          <h2 className="section-title">Why This Matters</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{whyItMatters}</p>
        </section>

        {/* Section 6: How To Use This Calculator */}
        <section className="mb-12 card">
          <h2 className="section-title">How To Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            {howToUse.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm -indent-1">
                  {index + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 7: Smart Insights — real panel built from the visitor's
            own results above, plus factual tips. No AI model is involved. */}
        <section className="mb-12">
          <button
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4 w-full md:w-auto justify-center"
            onClick={() => setShowInsights((prev) => !prev)}
          >
            <Zap className="w-5 h-5" />
            {showInsights ? 'Hide Smart Insights' : 'Get Smart Insights'}
          </button>
          {showInsights && (
            <div className="card mt-4">
              <h2 className="section-title">Smart Insights</h2>
              {hasResults ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Based on your numbers above
                    {results.mainResult ? `: ${results.mainResult.label} is ${results.mainResult.value}` : ''}.
                  </p>
                  {results.cards && results.cards.length > 0 && (
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                      {results.cards.map((card) => (
                        <li key={card.label}>
                          <strong className="text-gray-900 dark:text-white">{card.label}:</strong> {card.value}
                        </li>
                      ))}
                    </ul>
                  )}
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    {tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Run the calculator above first — your numbers and tips will appear here.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Section 8: FAQ */}
        <section className="mb-12">
          <FAQAccordion items={faqItems} calculatorName={name} />
        </section>

        {/* Section 9: Calculator Tools */}
        <section className="mb-12 card">
          <h2 className="section-title">Calculator Tools</h2>
          <div className="flex flex-wrap gap-4">
            <FavoritesButton calculatorId={id} calculatorName={name} path={path} />
            <DownloadPDFButton targetRef={resultsRef} filename={`${id}-results.pdf`} />
            <ShareButtons title={name} />
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </section>

        {/* Section 10: Related Calculators */}
        <section className="mb-12">
          <RelatedCalculators currentPath={path} />
        </section>

        {/* Section 11: Page Footer */}
        <section className="card bg-gray-100 dark:bg-dark-surface">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              <strong>Data Sources:</strong> Calculations use current federal tax rates, standard deductions, and average state tax rates. Exchange rates are approximate and updated regularly.
            </p>
            <p className="text-xs">
              <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. Results should not be considered professional financial, tax, or legal advice. Always consult with qualified professionals for specific financial decisions. Actual results may vary based on individual circumstances.
            </p>
          </div>
        </section>

        {children}
      </div>
    </div>
  )
}
