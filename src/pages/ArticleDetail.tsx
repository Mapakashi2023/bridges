import { useParams, Link, Navigate } from 'react-router-dom'
import { Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react'
import { articles } from '../data/articles'

const categoryColors: Record<string, string> = {
  'Study Abroad': 'bg-blue-50 text-[#1A4D8F]',
  'Career Development': 'bg-green-50 text-green-700',
  'Travel Tips': 'bg-yellow-50 text-yellow-700',
  Education: 'bg-purple-50 text-purple-700',
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h2 key={i} className="font-serif text-2xl font-bold text-gray-900 mt-8 mb-3">
          {line.slice(3)}
        </h2>
      )
    }
    if (line.startsWith('- **')) {
      const parts = line.slice(2).split('**')
      return (
        <li key={i} className="text-gray-700 text-base leading-relaxed mb-2">
          <strong>{parts[1]}</strong>{parts[2]}
        </li>
      )
    }
    if (line.startsWith('- ')) {
      return (
        <li key={i} className="text-gray-700 text-base leading-relaxed mb-2">
          {line.slice(2)}
        </li>
      )
    }
    if (line.trim() === '') return <div key={i} className="mt-2" />
    return (
      <p key={i} className="text-gray-700 text-base leading-relaxed mb-4">
        {line}
      </p>
    )
  })
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const article = articles.find((a) => a.slug === slug)
  const currentIndex = articles.findIndex((a) => a.slug === slug)
  const prev = currentIndex > 0 ? articles[currentIndex - 1] : null
  const next = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null

  if (!article) return <Navigate to="/articles" replace />

  return (
    <main className="pt-20">
      {/* Hero */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13,42,81,0.80) 0%, rgba(13,42,81,0.60) 100%), url('${article.imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
              categoryColors[article.category] ?? 'bg-white/20 text-white'
            }`}
          >
            <Tag className="w-3 h-3" />
            {article.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-blue-200 text-sm">
            <span className="font-medium text-white">{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-[#1A4D8F] font-semibold text-sm mb-8 hover:gap-3 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          {/* Content */}
          <div className="prose-custom">
            {renderContent(article.content)}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-12" />

          {/* CTA */}
          <div className="bg-[#f4f4f4] rounded-2xl p-7 text-center">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Ready to Experience Zambia?</h3>
            <p className="text-gray-600 text-sm mb-5">
              Apply to a World Bridge Academy program and take the first step toward a transformative cultural experience.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 bg-[#1A4D8F] text-white font-bold px-6 py-3 rounded-full hover:bg-[#143c70] transition-colors"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Prev/Next Navigation */}
          {(prev || next) && (
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  to={`/articles/${prev.slug}`}
                  className="group border border-gray-200 rounded-xl p-4 hover:border-[#1A4D8F] transition-colors"
                >
                  <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-[#1A4D8F] transition-colors line-clamp-2">
                    {prev.title}
                  </div>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  to={`/articles/${next.slug}`}
                  className="group border border-gray-200 rounded-xl p-4 hover:border-[#1A4D8F] transition-colors text-right"
                >
                  <div className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
                    Next <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-[#1A4D8F] transition-colors line-clamp-2">
                    {next.title}
                  </div>
                </Link>
              ) : <div />}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
