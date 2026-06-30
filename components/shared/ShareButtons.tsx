'use client'

import { Share2, Twitter, Facebook, Linkedin, Mail, MessageCircle } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url?: string
  text?: string
}

export default function ShareButtons({ title, url, text }: ShareButtonsProps) {
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = text || `Check out ${title} on CalculatorKing!`
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedText = encodeURIComponent(shareText)

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: '#1DA1F2',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#4267B2',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}`,
      color: '#0077B5',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: '#25D366',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: '#EA4335',
    },
  ]

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      alert('Link copied to clipboard!')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = pageUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full justify-center"
      >
        <Share2 className="w-4 h-4" />
        Copy Link
      </button>

      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link.url)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: link.color }}
          >
            <link.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{link.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
