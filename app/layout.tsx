import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CalculatorKing - Professional Financial Calculators',
  description: 'Free online calculators for salary, mortgage, investment, loans, taxes, and more. Calculate your finances with precision and ease.',
  keywords: 'calculator, financial calculator, salary calculator, mortgage calculator, investment calculator, tax calculator, loan calculator',
  authors: [{ name: 'CalculatorKing' }],
  openGraph: {
    title: 'CalculatorKing - Professional Financial Calculators',
    description: 'Free online calculators for salary, mortgage, investment, loans, taxes, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalculatorKing - Professional Financial Calculators',
    description: 'Free online calculators for salary, mortgage, investment, loans, taxes, and more.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
