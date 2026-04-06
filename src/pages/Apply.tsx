import { useState } from 'react'
import { CheckCircle2, Send, ArrowRight } from 'lucide-react'

const programOptions = [
  'Summer Internship (USA → Zambia)',
  'Study Abroad Program Design',
  'Homestay & Housing',
  'Orientation & Intercultural Training',
  'Visa Guidance & Travel Coordination',
  'Language & Cultural Immersion',
  'Full Package (All Services)',
  'Not Sure Yet – I Need Guidance',
]

const durationOptions = ['1–2 weeks', '3–4 weeks', '4–8 weeks', 'One Semester', 'Academic Year', 'Flexible / TBD']

const steps = ['Personal Info', 'Program Details', 'Background', 'Submit']

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  university: string
  graduationYear: string
  program: string
  duration: string
  startDate: string
  academicCredit: string
  background: string
  goals: string
  hearAboutUs: string
  agreeTerms: boolean
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  university: '',
  graduationYear: '',
  program: '',
  duration: '',
  startDate: '',
  academicCredit: '',
  background: '',
  goals: '',
  hearAboutUs: '',
  agreeTerms: false,
}

export default function Apply() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-[#f4f4f4]">
        <div className="max-w-md mx-auto px-4 text-center py-16">
          <div className="w-20 h-20 rounded-full bg-[#A8D5A2]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#1A4D8F]" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
          <p className="text-gray-600 leading-relaxed mb-7">
            Thank you for applying to World Bridge Academy. A member of our team will review your application and reach out within <strong>2–3 business days</strong> to discuss next steps.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Questions? Email us at{' '}
            <a href="mailto:info@worldbridgeacademy1.com" className="text-[#1A4D8F] font-medium hover:underline">
              info@worldbridgeacademy1.com
            </a>
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm(initialForm) }}
            className="text-[#1A4D8F] font-semibold hover:underline text-sm"
          >
            Submit another application
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#1A4D8F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Get Started</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Apply to a Program
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Fill out the form below and we'll match you with the right program. No commitment required—this is just the start of a conversation.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f4f4f4]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                    i === step
                      ? 'bg-[#1A4D8F] text-white'
                      : i < step
                      ? 'bg-[#A8D5A2] text-[#0d2a51] cursor-pointer'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </button>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#1A4D8F]' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && <div className="w-6 sm:w-12 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Step 0: Personal Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                    placeholder="you@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">University / Institution *</label>
                    <input
                      type="text"
                      required
                      value={form.university}
                      onChange={(e) => set('university', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                      placeholder="Your school name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Graduation Year</label>
                    <select
                      value={form.graduationYear}
                      onChange={(e) => set('graduationYear', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent bg-white"
                    >
                      <option value="">Select year</option>
                      {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                      <option value="Alumni">Alumni / Graduate</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Program Details */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Program Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Program of Interest *</label>
                  <select
                    required
                    value={form.program}
                    onChange={(e) => set('program', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent bg-white"
                  >
                    <option value="">Select a program</option>
                    {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Program Duration *</label>
                  <select
                    required
                    value={form.duration}
                    onChange={(e) => set('duration', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent bg-white"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Start Date / Term</label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={(e) => set('startDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                    placeholder="e.g. Summer 2025, January 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Are you seeking academic credit?</label>
                  <div className="flex flex-wrap gap-3">
                    {['Yes', 'No', 'Unsure'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="academicCredit"
                          value={opt}
                          checked={form.academicCredit === opt}
                          onChange={() => set('academicCredit', opt)}
                          className="accent-[#1A4D8F]"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Background */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Background & Goals</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Relevant background (major, experience, languages spoken)
                  </label>
                  <textarea
                    rows={3}
                    value={form.background}
                    onChange={(e) => set('background', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent resize-none"
                    placeholder="Tell us about your academic background and any relevant experience..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    What are your goals for this program? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.goals}
                    onChange={(e) => set('goals', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent resize-none"
                    placeholder="What do you hope to learn, experience, or achieve through this program?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you hear about us?</label>
                  <select
                    value={form.hearAboutUs}
                    onChange={(e) => set('hearAboutUs', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent bg-white"
                  >
                    <option value="">Select an option</option>
                    {['University / Professor', 'Social Media', 'Google Search', 'Word of Mouth', 'Study Abroad Fair', 'Other'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-5">Review & Submit</h2>
                <div className="bg-[#f4f4f4] rounded-xl p-5 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-900 font-medium">{form.firstName} {form.lastName}</span>
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900 font-medium">{form.email}</span>
                    <span className="text-gray-500">University</span>
                    <span className="text-gray-900 font-medium">{form.university || '—'}</span>
                    <span className="text-gray-500">Program</span>
                    <span className="text-gray-900 font-medium">{form.program || '—'}</span>
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-900 font-medium">{form.duration || '—'}</span>
                    <span className="text-gray-500">Start Date</span>
                    <span className="text-gray-900 font-medium">{form.startDate || '—'}</span>
                    <span className="text-gray-500">Academic Credit</span>
                    <span className="text-gray-900 font-medium">{form.academicCredit || '—'}</span>
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.agreeTerms}
                    onChange={(e) => set('agreeTerms', e.target.checked)}
                    className="mt-0.5 accent-[#1A4D8F]"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree that World Bridge Academy may use my application information to contact me about program options. I understand this is an inquiry, not a binding commitment.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors ${step === 0 ? 'invisible' : ''}`}
              >
                ← Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#1A4D8F] text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#143c70] transition-colors flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[#F5C518] text-[#1A4D8F] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#e0aa00] transition-colors flex items-center gap-2 shadow-md"
                >
                  Submit Application <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
