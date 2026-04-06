import { Link } from 'react-router-dom'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { articles } from '../data/articles'

const categoryColors: Record<string, string> = {
  'Study Abroad': 'bg-blue-50 text-[#1A4D8F]',
  'Career Development': 'bg-green-50 text-green-700',
  'Travel Tips': 'bg-yellow-50 text-yellow-700',
  Education: 'bg-purple-50 text-purple-700',
}

export default function Articles() {
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#1A4D8F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Articles</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Insights & Resources
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Guides, perspectives, and stories about cultural exchange, study abroad, and intercultural education.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          <div className="mb-14">
            <span className="text-[#1A4D8F] text-sm font-semibold tracking-widest uppercase mb-5 block">Featured</span>
            <Link to={`/articles/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 bg-[#f4f4f4] rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="overflow-hidden">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="w-full h-64 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-7 lg:p-9 flex flex-col justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit ${
                    categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {featured.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#1A4D8F] transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5 text-sm">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="font-medium text-gray-600">{featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featured.readTime}
                    </span>
                  </div>
                  <span className="text-[#1A4D8F] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Article Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                to={`/articles/${article.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
                      categoryColors[article.category] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                  <h3 className="font-serif font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-[#1A4D8F] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
