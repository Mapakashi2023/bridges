import { Link } from 'react-router-dom'
import { Globe2, Mail, Phone, MapPin, Clock } from 'lucide-react'

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M4 4l16 16M4 20 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

const footerLinks = {
  Programs: [
    { label: 'Summer Internships', to: '/programs#summer-internship' },
    { label: 'Study Abroad', to: '/programs#study-abroad' },
    { label: 'Homestay', to: '/programs#homestay' },
    { label: 'Orientation Training', to: '/programs#orientation' },
    { label: 'Visa & Travel', to: '/programs#visa-travel' },
    { label: 'Language Immersion', to: '/programs#language-immersion' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Articles', to: '/articles' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
    { label: 'Apply Now', to: '/apply' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0d2a51] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#F5C518] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-[#1A4D8F]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-white">World Bridge</span>
                <span className="text-xs font-medium tracking-widest uppercase text-[#F5C518]">Academy</span>
              </div>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Creating life-changing cultural experiences that empower students to connect across borders and contribute meaningfully to global communities.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F5C518] hover:text-[#1A4D8F] transition-colors duration-200"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-blue-200 hover:text-[#F5C518] text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F5C518] mt-0.5 flex-shrink-0" />
                <a href="mailto:info@worldbridgeacademy1.com" className="text-blue-200 hover:text-[#F5C518] text-sm transition-colors">
                  info@worldbridgeacademy1.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F5C518] mt-0.5 flex-shrink-0" />
                <a href="tel:+12095127771" className="text-blue-200 hover:text-[#F5C518] text-sm transition-colors">
                  +1 (209) 512-7771
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F5C518] mt-0.5 flex-shrink-0" />
                <span className="text-blue-200 text-sm">
                  411 W Esplanade Dr.<br />Oxnard, CA 93033, USA
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F5C518] mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p>Mon – Fri, 9:00 AM – 3:00 PM</p>
                  <p className="text-blue-300 text-xs mt-0.5">US Pacific & Zambia Time</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-xs">
            © {new Date().getFullYear()} World Bridge Academy. All rights reserved.
          </p>
          <p className="text-blue-300 text-xs">
            Connecting cultures. Empowering students. Building bridges.
          </p>
        </div>
      </div>
    </footer>
  )
}
