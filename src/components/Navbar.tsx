import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Globe2 } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/articles', label: 'Articles' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  const navBg =
    isHome && !scrolled
      ? 'bg-transparent'
      : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800'
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-[#1A4D8F]'
  const hoverColor = isHome && !scrolled ? 'hover:text-[#F5C518]' : 'hover:text-[#1A4D8F]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1A4D8F] flex items-center justify-center group-hover:bg-[#F5C518] transition-colors duration-200">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-bold text-sm sm:text-base tracking-tight ${logoColor} transition-colors duration-300`}>
                World Bridge
              </span>
              <span className={`text-xs font-medium tracking-widest uppercase ${isHome && !scrolled ? 'text-[#F5C518]' : 'text-[#F5C518]'}`}>
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${textColor} ${hoverColor} ${
                    isActive
                      ? isHome && !scrolled
                        ? 'text-[#F5C518]'
                        : 'text-[#1A4D8F] font-semibold'
                      : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA Button (desktop) */}
          <div className="hidden lg:block">
            <Link
              to="/apply"
              className="bg-[#F5C518] text-[#1A4D8F] font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-[#e0aa00] transition-colors duration-200 shadow-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-md ${textColor} ${hoverColor}`}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1A4D8F] transition-colors ${
                    isActive ? 'bg-blue-50 text-[#1A4D8F] font-semibold' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 px-4">
              <Link
                to="/apply"
                className="block w-full text-center bg-[#F5C518] text-[#1A4D8F] font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-[#e0aa00] transition-colors duration-200"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
