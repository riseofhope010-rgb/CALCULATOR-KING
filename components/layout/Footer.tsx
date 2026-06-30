import Link from 'next/link'
import { Calculator, Mail } from 'lucide-react'
import { Github, Twitter, Linkedin } from '@/components/shared/BrandIcons'

const CALCULATOR_LINKS = [
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
]

const COMPANY_LINKS = [
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Disclaimer', path: '/disclaimer' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Calculator className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-white">
                Calculator<span className="text-primary">King</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Professional financial calculators for everyone. Calculate salaries, mortgages, investments, and more with precision and ease.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Calculators
            </h3>
            <ul className="space-y-2">
              {CALCULATOR_LINKS.slice(0, 6).map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              More Calculators
            </h3>
            <ul className="space-y-2">
              {CALCULATOR_LINKS.slice(6).map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/calculators"
                  className="text-sm text-primary hover:text-primary-400 transition-colors font-medium"
                >
                  View All Calculators
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} CalculatorKing. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/disclaimer" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center md:text-left">
            Disclaimer: The calculations provided by CalculatorKing are for informational purposes only and should not be considered as professional financial advice. Always consult with a qualified professional for specific financial decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
