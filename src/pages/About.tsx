import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Target, Eye, Heart } from 'lucide-react'

const timeline = [
  {
    year: '2020',
    title: 'Founded as a Tour Agency',
    desc: 'World Bridge Academy began as a tour agency showcasing Zambia\'s rich cultural heritage to local and international visitors.',
  },
  {
    year: '2021',
    title: 'Expanding Into Education',
    desc: 'Recognizing the deeper impact of educational immersion, we pivoted to designing structured intercultural programs for students.',
  },
  {
    year: '2022',
    title: 'U.S. Partnerships Established',
    desc: 'Forged key relationships with U.S. colleges and universities, enabling credit-bearing program options aligned with American academic standards.',
  },
  {
    year: '2023',
    title: 'Community Network Grows',
    desc: 'Expanded partnerships with Zambian NGOs, community organizations, and local institutions for authentic internship and homestay placements.',
  },
  {
    year: '2024+',
    title: 'Dynamic Cultural Exchange Hub',
    desc: 'Today, World Bridge Academy operates as a full-service cultural exchange agency, connecting U.S. students with transformative Zambian experiences.',
  },
]

const values = [
  {
    icon: Heart,
    title: 'Authenticity',
    desc: 'We believe in real immersion—not staged performances. Every experience is rooted in genuine community relationships.',
  },
  {
    icon: Target,
    title: 'Purpose',
    desc: 'Every program element is intentional. We design with learning outcomes, cultural respect, and student growth in mind.',
  },
  {
    icon: Eye,
    title: 'Equity',
    desc: 'We work to make global education accessible—partnering with institutions to leverage financial aid and reduce barriers.',
  },
]

const usps = [
  'Tailored, credit-bearing programs aligned with U.S. academic standards',
  'Deep local connections with Zambian communities, NGOs, and institutions',
  'Comprehensive safety: housing, transportation, and medical preparedness',
  'Transparent pricing with financial aid-eligible packages',
  'Real cultural immersion beyond tourist experiences',
  'Over 4 years of professional program design experience',
]

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section
        className="relative py-24 flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(13,42,81,0.92) 0%, rgba(26,77,143,0.7) 100%), url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">About Us</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-5 max-w-2xl leading-tight">
            Connecting Cultures Through Education
          </h1>
          <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
            World Bridge Academy was born from a simple but powerful belief: that education and culture, experienced together, are the most effective catalysts for human understanding.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">Mission & Vision</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Our Purpose
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-[#1A4D8F] pl-5">
                  <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To create life-changing cultural experiences that empower students to connect across borders, develop intercultural skills, and contribute meaningfully to global communities.
                  </p>
                </div>
                <div className="border-l-4 border-[#F5C518] pl-5">
                  <h3 className="font-bold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    A world where young people from diverse backgrounds learn side by side, grow through genuine cultural encounter, and become lifelong advocates for global understanding.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start bg-[#f4f4f4] rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-[#1A4D8F] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-20 bg-[#f4f4f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">Our Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              From Tour Agency to Cultural Exchange Hub
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-[#1A4D8F]/20 hidden sm:block" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-10 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Year bubble */}
                  <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-0 z-10 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#1A4D8F] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                      {item.year}
                    </div>
                  </div>

                  {/* Content box */}
                  <div
                    className={`sm:w-5/12 ${
                      i % 2 === 0 ? 'sm:mr-auto sm:pr-10' : 'sm:ml-auto sm:pl-10'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Experience */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=80"
                alt="Program coordination"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div>
              <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase">Industry Experience</span>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mt-2 mb-6">
                What We Bring to Every Program
              </h2>
              <ul className="space-y-3 mb-8">
                {usps.map((usp) => (
                  <li key={usp} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#A8D5A2] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm leading-relaxed">{usp}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 bg-[#1A4D8F] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#143c70] transition-colors"
              >
                Explore Our Programs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F5C518]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#0d2a51] mb-4">
            Ready to Be Part of the Bridge?
          </h2>
          <p className="text-[#1A4D8F] mb-7">
            Join a growing community of students and institutions committed to intercultural education.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-[#1A4D8F] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#0d2a51] transition-colors"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
