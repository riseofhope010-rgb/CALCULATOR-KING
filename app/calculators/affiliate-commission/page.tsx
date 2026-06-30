'use client'

import React, { useState, useEffect } from 'react'
import CalculatorPageTemplate from '@/components/calculators/CalculatorPageTemplate'
import { calculateAffiliate, AffiliateInput, AffiliateResult } from '@/lib/calculations/affiliate'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils/format'

export default function AffiliateCommissionPage() {
  const [inputs, setInputs] = useState<AffiliateInput>({
    monthlyVisitors: 50000,
    conversionRate: 2,
    averageOrderValue: 75,
    commissionRate: 8,
    clickThroughRate: 3,
  })
  const [results, setResults] = useState<AffiliateResult | null>(null)

  useEffect(() => {
    const calculated = calculateAffiliate(inputs)
    setResults(calculated)
  }, [inputs])

  const handleInputChange = (field: keyof AffiliateInput, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }))
  }

  const calculatorForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Visitors
        </label>
        <input
          type="number"
          value={inputs.monthlyVisitors}
          onChange={(e) => handleInputChange('monthlyVisitors', e.target.value)}
          className="input-field"
          placeholder="50000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Click-Through Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.clickThroughRate}
            onChange={(e) => handleInputChange('clickThroughRate', e.target.value)}
            className="input-field pr-8"
            placeholder="3"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">% of visitors who click affiliate links</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conversion Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            value={inputs.conversionRate}
            onChange={(e) => handleInputChange('conversionRate', e.target.value)}
            className="input-field pr-8"
            placeholder="2"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">% of clicks that result in purchase</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Average Order Value
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={inputs.averageOrderValue}
            onChange={(e) => handleInputChange('averageOrderValue', e.target.value)}
            className="input-field pl-8"
            placeholder="75"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Commission Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.5"
            value={inputs.commissionRate}
            onChange={(e) => handleInputChange('commissionRate', e.target.value)}
            className="input-field pr-8"
            placeholder="8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">% of sale you receive as commission</p>
      </div>
    </div>
  )

  const resultsDisplay = results ? {
    mainResult: {
      label: 'Monthly Revenue',
      value: formatCurrency(results.monthlyRevenue),
      subtext: `Annual: ${formatCurrency(results.annualRevenue)}`,
    },
    cards: [
      { label: 'Monthly Clicks', value: formatNumber(results.monthlyClicks), color: '#2563EB' },
      { label: 'Monthly Sales', value: formatNumber(results.monthlyConversions), color: '#10B981' },
      { label: 'Revenue/Visitor', value: `$${results.revenuePerVisitor}`, color: '#F59E0B' },
    ],
    barData: results.projectedGrowth.slice(0, 6).map(p => ({
      name: `M${p.month}`,
      value: p.revenue,
    })),
    tableData: {
      headers: ['Month', 'Visitors', 'Sales', 'Revenue'],
      rows: results.projectedGrowth.slice(0, 6).map(p => [
        `Month ${p.month}`,
        formatNumber(p.visitors),
        formatNumber(p.conversions),
        formatCurrency(p.revenue),
      ]),
    },
  } : null

  return (
    <CalculatorPageTemplate
      id="affiliate-commission"
      name="Affiliate Commission Calculator"
      description="Estimate your affiliate marketing earnings potential"
      path="/calculators/affiliate-commission"
      heroContent="Affiliate marketing has become a significant income stream for content creators, bloggers, and influencers. However, estimating potential earnings can be complex due to multiple variables: traffic, click-through rates, conversion rates, order values, and commission structures. Our Affiliate Commission Calculator helps you model realistic revenue scenarios by combining all these factors. Whether you're evaluating affiliate opportunities, planning content strategy, or forecasting income, this calculator provides clarity on what it takes to reach your financial goals."
      calculatorForm={calculatorForm}
      results={resultsDisplay || {}}
      whatNumbersMean="Monthly clicks shows how many visitors interact with your affiliate links. Monthly conversions represent actual purchases through your links. Monthly revenue is your commission earnings. Revenue per visitor shows how much each visitor is worth to you—a crucial metric for evaluating traffic acquisition costs. The growth projection assumes 10% monthly traffic growth to show compounding potential over time."
      whyItMatters="Understanding these metrics helps you optimize your affiliate strategy. If your revenue per visitor is low, you might need higher-commission products or better placement. If conversion rates are low, maybe the offer doesn't match your audience. These numbers show where to focus improvements—more traffic, better links, higher-converting products, or better commissions."
      howToUse={[
        "Enter your monthly website or platform traffic.",
        "Estimate your affiliate link click-through rate.",
        "Input the typical conversion rate for purchases.",
        "Add average order value for products you promote.",
        "Set commission rate from affiliate programs you use or plan to join.",
      ]}
      faqItems={[
        { question: "What is a good conversion rate?", answer: "Typical affiliate conversion rates range from 1-5%. Higher rates come from well-targeted audiences and strong recommendations. Review sites often see 2-3%, while direct recommendations can exceed 5%. 10%+ is achievable with highly relevant offers on engaged audiences." },
        { question: "What commission rates can I expect?", answer: "Rates vary by industry: Amazon Associates pays 1-10%% (most categories 3-5%%), software SaaS often offers 20-40%, digital products 30-50%. Higher rates don't always mean more money—consider conversion likelihood and order values." },
        { question: "How important is traffic vs conversion?", answer: "Both matter. A 1% conversion rate with 100,000 visitors equals a 10% conversion rate with 10,000 visitors. Typically easier to improve conversion rate than multiply traffic. Focus where you have the most leverage." },
        { question: "Should I promote high or low cost products?", answer: "It depends. Low-cost products convert easier but need volume. High-ticket products earn more per sale but need stronger trust. Test both—the best strategy is often a mix of lower-price converters and commission opportunities." },
        { question: "How do cookies affect my earnings?", answer: "Affiliate cookies track visitors for a period (24 hours on Amazon to 30+ days on other programs). Longer cookies mean you can earn from purchases made days later. Some programs offer recurring commissions for subscription products." },
        { question: "What about recurring commissions?", answer: "Many SaaS and subscription products offer lifetime or monthly recurring commissions. These can be very lucrative—a $100/month subscription paying 30% commission equals $360/year per customer from one referral." },
        { question: "How do I increase click-through rate?", answer: "Place affiliate links where they're naturally seen: within content, near relevant information. Use clear calls-to-action. Honest recommendations convert better than aggressive placements. Test link positioning and wording." },
        { question: "What income is realistic?", answer: "Successful affiliates earn anywhere from $100-10,000+ monthly. Most start under $500. Building substantial income typically requires 6-12 months and 50,000+ monthly visitors. Focus on providing value and building audience trust." },
      ]}
    />
  )
}
