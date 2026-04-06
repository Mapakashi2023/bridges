import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f4f4f4] flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <div className="text-8xl font-bold text-[#1A4D8F]/10 mb-2 font-serif">404</div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-[#1A4D8F] text-white font-bold px-6 py-3 rounded-full hover:bg-[#143c70] transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/programs"
            className="border-2 border-[#1A4D8F] text-[#1A4D8F] font-semibold px-6 py-3 rounded-full hover:bg-[#1A4D8F] hover:text-white transition-colors flex items-center gap-2"
          >
            Our Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
