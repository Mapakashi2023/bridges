import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, BookOpen, Users, Shield, DollarSign, Star, ChevronRight } from 'lucide-react'
import { programs } from '../data/programs'

const usps = [
  {
    icon: BookOpen,
    title: 'Tailored Programs',
    desc: 'Flexible, credit-bearing options designed to align with U.S. academic standards and your institution\'s goals.',
  },
  {
    icon: Globe2,
    title: 'Deep Local Connections',
    desc: 'Partnerships with Zambian communities, NGOs, and institutions built over years of relationship-building.',
  },
  {
    icon: Shield,
    title: 'Safety & Support',
    desc: 'Comprehensive housing, transportation, and medical preparedness policies keep you protected throughout.',
  },
  {
    icon: DollarSign,
    title: 'Affordable & Transparent',
    desc: 'Clear pricing with flexible packages—students can use financial aid when partnered with colleges.',
  },
  {
    icon: Users,
    title: 'Real Immersion',
    desc: 'Authentic cultural experiences that go far beyond tourist itineraries and surface-level visits.',
  },
  {
    icon: Star,
    title: '4+ Years Experience',
    desc: 'Over four years designing and delivering professional and cultural immersion programs with proven results.',
  },
]

const stats = [
  { value: '4+', label: 'Years of Experience' },
  { value: '6', label: 'Program Types' },
  { value: 'Zambia ↔ USA', label: 'Cultural Bridge' },
  { value: '100%', label: 'Student Support' },
]

const testimonials = [
  {
    quote:
      'World Bridge Academy completely changed my perspective on global development. My internship in Zambia was the most meaningful experience of my college career.',
    name: 'Sarah M.',
    role: 'University of California, Davis – Alumni',
  },
  {
    quote:
      'The team handled everything from my visa to my homestay. I arrived with confidence and left with lifelong friendships and professional skills.',
    name: 'James T.',
    role: 'Georgetown University – Study Abroad Participant',
  },
  {
    quote:
      'As a faculty coordinator, I was impressed by their professionalism and the depth of community partnerships. Our students thrived.',
    name: 'Dr. Linda W.',
    role: 'Program Director, Pacific University',
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13,42,81,0.72) 0%, rgba(26,77,143,0.55) 60%, rgba(13,42,81,0.85) 100%), url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 pt-32">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
            Zambia ↔ USA Cultural Exchange Programs
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Build Bridges.
            <br />
            <span className="text-[#F5C518]">Cross Borders.</span>
            <br />
            Change Lives.
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            World Bridge Academy creates transformative cultural exchange programs connecting U.S. students with Zambia's vibrant communities, institutions, and landscapes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/apply"
              className="bg-[#F5C518] text-[#1A4D8F] font-bold px-8 py-3.5 rounded-full text-base hover:bg-[#e0aa00] transition-colors shadow-lg flex items-center gap-2"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/programs"
              className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-white/15 transition-colors"
            >
              Explore Programs
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-white/40" />
          <span className="text-white/50 text-xs">Scroll</span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#1A4D8F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-[#F5C518]">{stat.value}</div>
                <div className="text-blue-200 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">Our Mission</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-5 leading-tight">
                Education That Opens Doors. Experiences That Change Lives.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                World Bridge Academy was founded with a vision to connect cultures through the power of education. What began as a tour agency showcasing Zambia's rich heritage has evolved into a dynamic hub for intercultural learning.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our programs are carefully designed to be structured yet flexible, blending academic rigor with cultural immersion. Students develop intellectually, grow personally and socially, and make lasting contributions to the communities that host them.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-[#1A4D8F] font-semibold hover:gap-3 transition-all duration-200">
                Learn Our Story <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=80"
                alt="Zambia cultural experience"
                className="rounded-2xl shadow-xl w-full object-cover h-96"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#F5C518] rounded-2xl p-5 shadow-xl hidden sm:block">
                <div className="text-[#1A4D8F] font-bold text-2xl">4+</div>
                <div className="text-[#1A4D8F] text-sm font-medium">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-20 bg-[#f4f4f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">Why Choose Us</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              What Makes Us Different
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#1A4D8F]" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">What We Offer</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Our Programs</h2>
            </div>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-[#1A4D8F] font-semibold border-b-2 border-[#F5C518] pb-0.5 hover:text-[#F5C518] transition-colors"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.slice(0, 3).map((prog) => (
              <div key={prog.id} className="group rounded-2xl border border-gray-200 p-6 hover:border-[#1A4D8F] hover:shadow-md transition-all duration-200">
                {prog.highlight && (
                  <span className="inline-block bg-[#F5C518]/20 text-[#1A4D8F] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {prog.highlight}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-[#1A4D8F] transition-colors">
                  {prog.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{prog.description}</p>
                {prog.duration && (
                  <span className="text-xs text-gray-400 font-medium">Duration: {prog.duration}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1A4D8F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Testimonials</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
              What Students Say
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#F5C518] fill-[#F5C518]" />
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#F5C518]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d2a51] mb-4">
            Ready to Cross the Bridge?
          </h2>
          <p className="text-[#1A4D8F] text-lg mb-8 max-w-xl mx-auto">
            Take the first step toward a life-changing cultural experience. Apply today or reach out with your questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/apply"
              className="bg-[#1A4D8F] text-white font-bold px-8 py-3.5 rounded-full text-base hover:bg-[#0d2a51] transition-colors shadow-md flex items-center gap-2"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[#1A4D8F] text-[#1A4D8F] font-semibold px-8 py-3.5 rounded-full text-base hover:bg-[#1A4D8F] hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
