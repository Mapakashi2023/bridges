import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, BookOpen, Home, Users, Globe, Mic, CheckCircle2, Clock, Tag } from 'lucide-react'
import { programs } from '../data/programs'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  BookOpen,
  Home,
  Users,
  Globe,
  Mic,
}

export default function Programs() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section
        className="relative py-24"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(13,42,81,0.93) 0%, rgba(26,77,143,0.80) 100%), url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Programs</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-5 max-w-2xl leading-tight">
            Programs Designed for Real Impact
          </h1>
          <p className="text-blue-100 text-lg max-w-xl leading-relaxed mb-8">
            Every program is built with purpose—blending academic structure with genuine cultural immersion so students leave Zambia changed.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1A4D8F] font-bold px-7 py-3 rounded-full hover:bg-[#e0aa00] transition-colors shadow-md"
          >
            Apply to a Program <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">What We Offer</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              All Programs & Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Mix and match services to build the perfect cultural exchange experience for your needs or your institution's goals.
            </p>
          </div>

          <div className="space-y-10">
            {programs.map((prog, i) => {
              const Icon = iconMap[prog.icon] ?? Globe
              const isEven = i % 2 === 0
              return (
                <div
                  key={prog.id}
                  id={prog.id}
                  className={`grid lg:grid-cols-2 gap-8 items-center rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
                >
                  {/* Icon/Visual side */}
                  <div
                    className={`p-10 flex flex-col justify-center bg-gradient-to-br from-[#1A4D8F] to-[#143c70] ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white mb-3">{prog.title}</h2>
                    <p className="text-blue-100 leading-relaxed mb-5">{prog.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {prog.duration && (
                        <div className="flex items-center gap-1.5 text-[#F5C518] text-sm">
                          <Clock className="w-4 h-4" />
                          {prog.duration}
                        </div>
                      )}
                      {prog.highlight && (
                        <div className="flex items-center gap-1.5 text-[#A8D5A2] text-sm">
                          <Tag className="w-4 h-4" />
                          {prog.highlight}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details side */}
                  <div className={`p-8 lg:p-10 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <h3 className="font-semibold text-gray-900 text-lg mb-5">What's Included</h3>
                    <ul className="space-y-3 mb-7">
                      {prog.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#A8D5A2] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-2 text-[#1A4D8F] font-semibold text-sm hover:gap-3 transition-all duration-200 border-b border-[#F5C518] pb-0.5"
                    >
                      Inquire About This Program <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#f4f4f4]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            Not Sure Which Program Is Right for You?
          </h2>
          <p className="text-gray-600 mb-7 max-w-lg mx-auto">
            Reach out and we'll help you find the perfect fit based on your academic goals, timeline, and interests.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="bg-[#1A4D8F] text-white font-bold px-7 py-3 rounded-full hover:bg-[#143c70] transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              to="/faq"
              className="border-2 border-[#1A4D8F] text-[#1A4D8F] font-semibold px-7 py-3 rounded-full hover:bg-[#1A4D8F] hover:text-white transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
