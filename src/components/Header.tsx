'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Budgets', href: '/budgets' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-blue-50 shadow-sm border-b">
      <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className='bg-blue-50'
        />
        <h1 className="text-2xl font-bold text-blue-900 ml-0">
          <span className="text-blue-800">Fin</span>
          <span className="text-blue-600">Sight</span>
        </h1>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-700 pb-1 border-b-2 border-transparent',
                pathname === link.href
                  ? 'text-blue-900 font-semibold border-blue-600'
                  : 'text-blue-600'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-blue-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden bg-blue-50 border-t border-blue-100 shadow-inner">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-700 pb-1 border-b border-blue-100',
                  pathname === link.href
                    ? 'text-blue-900 font-semibold underline'
                    : 'text-blue-600'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

