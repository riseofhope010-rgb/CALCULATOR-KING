'use client'

import React, { useRef } from 'react'
import { Zap, RotateCcw } from 'lucide-react'
import ResultsDisplay from '@/components/shared/ResultsDisplay'
import FavoritesButton from '@/components/shared/FavoritesButton'
import ShareButtons from '@/components/shared/ShareButtons'
import DownloadPDFButton from '@/components/shared/DownloadPDFButton'
import RelatedCalculators from '@/components/shared/RelatedCalculators'
import FAQAccordion from '@/components/shared/FAQAccordion'

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
  const hasResults = results.mainResult || results.cards || results.pieData || results.barData

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

        {/* Section 7: AI Smart Insights */}
        <section className="mb-12">
          <button
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4 w-full md:w-auto justify-center"
            onClick={() => alert('AI Smart Insights coming soon! This feature will provide personalized analysis and recommendations.')}
          >
            <Zap className="w-5 h-5" />
            Get Smart Insights
          </button>
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
