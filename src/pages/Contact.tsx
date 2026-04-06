import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@worldbridgeacademy1.com',
    href: 'mailto:info@worldbridgeacademy1.com',
  },
  {
    icon: Phone,
    label: 'Phone (US)',
    value: '+1 (209) 512-7771',
    href: 'tel:+12095127771',
  },
  {
    icon: MapPin,
    label: 'US Office',
    value: '411 W Esplanade Dr., Oxnard, CA 93033, USA',
    href: 'https://maps.google.com/?q=411+W+Esplanade+Dr+Oxnard+CA+93033',
  },
]

const hours = [
  { zone: 'US Pacific Time', time: 'Mon – Fri, 9:00 AM – 3:00 PM PST' },
  { zone: 'Zambia (CAT)', time: 'Mon – Fri, 8:00 PM – 2:00 AM CAT' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#1A4D8F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Contact</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Get in Touch
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Have questions about our programs? Ready to start planning? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f4f4f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-[#A8D5A2]/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[#1A4D8F]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Thank you for reaching out. We'll get back to you within 1–2 business days.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="text-[#1A4D8F] font-semibold text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent"
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => set('subject', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent bg-white"
                        >
                          <option value="">Select a subject</option>
                          {[
                            'Program Inquiry',
                            'Partnership Opportunity',
                            'Application Question',
                            'Pricing & Financial Aid',
                            'General Question',
                            'Other',
                          ].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                        <textarea
                          rows={5}
                          required
                          value={form.message}
                          onChange={(e) => set('message', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4D8F] focus:border-transparent resize-none"
                          placeholder="Tell us about your interest, questions, or how we can help..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#1A4D8F] text-white font-bold py-3 rounded-full hover:bg-[#143c70] transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        Send Message <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-5">Contact Information</h2>
                <div className="space-y-5">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#1A4D8F]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="text-gray-800 text-sm hover:text-[#1A4D8F] transition-colors font-medium"
                        >
                          {value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#F5C518]/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#1A4D8F]" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">Business Hours</h2>
                </div>
                <div className="space-y-4">
                  {hours.map((h) => (
                    <div key={h.zone} className="border-l-3 border-[#1A4D8F] pl-4 py-1" style={{ borderLeftWidth: '3px' }}>
                      <div className="font-semibold text-gray-900 text-sm">{h.zone}</div>
                      <div className="text-gray-500 text-sm mt-0.5">{h.time}</div>
                    </div>
                  ))}
                  <p className="text-gray-400 text-xs mt-2">
                    Response time: We aim to respond to all inquiries within 1–2 business days.
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <iframe
                  title="World Bridge Academy Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.5!2d-119.177!3d34.1975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s411+W+Esplanade+Dr%2C+Oxnard%2C+CA+93033!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                <div className="p-4">
                  <p className="text-gray-600 text-sm font-medium">411 W Esplanade Dr., Oxnard, CA 93033</p>
                  <a
                    href="https://maps.google.com/?q=411+W+Esplanade+Dr+Oxnard+CA+93033"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1A4D8F] text-xs font-semibold hover:underline mt-0.5 block"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
