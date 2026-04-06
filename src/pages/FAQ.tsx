import { useState } from 'react'
import { ChevronDown, Link as LinkIcon } from 'lucide-react'
import { faqs } from '../data/faq'
import { Link } from 'react-router-dom'

const categoryColors: Record<string, string> = {
  General: 'bg-blue-50 text-[#1A4D8F]',
  'Academics & Credit': 'bg-green-50 text-green-700',
  'Cost & Financial Aid': 'bg-yellow-50 text-yellow-700',
  'Safety & Health': 'bg-red-50 text-red-600',
  'Logistics & Visa': 'bg-purple-50 text-purple-600',
  Housing: 'bg-orange-50 text-orange-600',
  Application: 'bg-teal-50 text-teal-600',
}

const allCategories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))]

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#1A4D8F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">FAQ</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Everything you need to know about our programs, safety, cost, visas, and more.
          </p>
        </div>
      </section>

      <section className="py-14 bg-[#f4f4f4]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#1A4D8F] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1A4D8F] hover:text-[#1A4D8F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {filtered.map((item) => {
              const isOpen = open === item.id
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all duration-200 ${
                    isOpen ? 'border-[#1A4D8F] shadow-sm' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 ${
                          categoryColors[item.category] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                        isOpen ? 'rotate-180 text-[#1A4D8F]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Still have questions */}
          <div className="mt-14 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F5C518]/20 flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-6 h-6 text-[#1A4D8F]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Still Have Questions?</h3>
            <p className="text-gray-500 text-sm mb-5">
              Can't find what you're looking for? Our team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="bg-[#1A4D8F] text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#143c70] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/apply"
                className="border border-[#1A4D8F] text-[#1A4D8F] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#1A4D8F] hover:text-white transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
