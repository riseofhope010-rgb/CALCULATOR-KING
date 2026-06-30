export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export function generateFAQSchema(faqItems: FAQItem[]): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function formatFAQSchemaAsScript(faqItems: FAQItem[]): string {
  const schema = generateFAQSchema(faqItems)
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
