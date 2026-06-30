'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  calculatorName: string
}

export default function FAQAccordion({ items, calculatorName }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate FAQ Schema markup
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-4">
        <h2 className="section-title">
          Frequently Asked Questions About {calculatorName}
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="card cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => toggleItem(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
