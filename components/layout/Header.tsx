'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Sun, Moon, Menu, X, Globe } from 'lucide-react'

const CALCULATORS = [
  { name: 'Salary Calculator', path: '/calculators/salary' },
  { name: 'Tax Calculator', path: '/calculators/tax' },
  { name: 'Mortgage Calculator', path: '/calculators/mortgage' },
  { name: 'Investment Calculator', path: '/calculators/investment' },
  { name: 'Loan Calculator', path: '/calculators/loan' },
  { name: 'Retirement Calculator', path: '/calculators/retirement' },
  { name: 'Currency Converter', path: '/calculators/currency' },
  { name: 'Compound Interest', path: '/calculators/compound-interest' },
  { name: 'BMI Calculator', path: '/calculators/bmi' },
  { name: 'Calorie Calculator', path: '/calculators/calorie' },
  { name: 'Freelance Rate', path: '/calculators/freelance-rate' },
  { name: 'ROI Calculator', path: '/calculators/roi' },
  { name: 'Affiliate Commission', path: '/calculators/affiliate-commission' },
  { name: 'Cost of Living', path: '/calculators/cost-of-living' },
  { name: 'Cryptocurrency', path: '/calculators/crypto' },
  { name: 'Loan EMI', path: '/calculators/loan-emi' },
  { name: 'Forex Calculator', path: '/calculators/forex' },
  { name: 'Contractor Income', path: '/calculators/contractor-income' },
  { name: 'Pension Calculator', path: '/calculators/pension' },
  { name: 'Profit Margin', path: '/calculators/profit-margin' },
]

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem('calculator_king_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = stored === 'dark' || (!stored && prefersDark)
    setIsDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  const toggleDarkMode = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('calculator_king_theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Calculator className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Calculator<span className="text-primary">King</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              Home
            </Link>

            {/* Calculators Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsCalculatorsOpen(true)}
                onMouseLeave={() => setIsCalculatorsOpen(false)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  pathname.includes('/calculators') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                Calculators
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCalculatorsOpen && (
                <div
                  onMouseEnter={() => setIsCalculatorsOpen(true)}
                  onMouseLeave={() => setIsCalculatorsOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 mt-1"
                >
                  {CALCULATORS.map((calc) => (
                    <Link
                      key={calc.path}
                      href={calc.path}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {calc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/calculators"
              className={`text-sm font-medium transition-colors ${
                pathname === '/calculators' ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              All Calculators
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle (Placeholder) */}
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Home
              </Link>
              <Link
                href="/calculators"
                onClick={() => setIsMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/calculators' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                All Calculators
              </Link>
              {CALCULATORS.slice(0, 10).map((calc) => (
                <Link
                  key={calc.path}
                  href={calc.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {calc.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
