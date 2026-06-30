'use client'

import { useState, useRef } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface DownloadPDFButtonProps {
  targetRef?: React.RefObject<HTMLDivElement | null>
  filename?: string
}

export default function DownloadPDFButton({
  targetRef,
  filename = 'calculator-results.pdf',
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    if (!targetRef?.current) return

    setIsGenerating(true)

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      const element = targetRef.current

      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </button>
  )
}
