import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

const categories = ['All', 'Culture', 'Nature', 'Education', 'Community', 'Landmarks']

const photos = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=75',
    caption: 'Victoria Falls, Zambia',
    category: 'Landmarks',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=75',
    caption: 'Zambian savanna landscape',
    category: 'Nature',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=75',
    caption: 'Students in classroom collaboration',
    category: 'Education',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=75',
    caption: 'Cross-cultural team meeting',
    category: 'Education',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=75',
    caption: 'Traditional Zambian ceremony',
    category: 'Culture',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1504173010664-32509107de63?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1504173010664-32509107de63?w=400&q=75',
    caption: 'Community gathering',
    category: 'Community',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=400&q=75',
    caption: 'Wildlife in Zambia national park',
    category: 'Nature',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1526659666037-99d886e5b55c?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1526659666037-99d886e5b55c?w=400&q=75',
    caption: 'Traditional craft workshop',
    category: 'Culture',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=75',
    caption: 'Lake Tanganyika shoreline',
    category: 'Nature',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=75',
    caption: 'Community health outreach program',
    category: 'Community',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=75',
    caption: 'Students engaged in cultural exchange',
    category: 'Education',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1547623542-de3ff5941ddb?w=400&q=75',
    caption: 'Lusaka cityscape',
    category: 'Landmarks',
  },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<(typeof photos)[0] | null>(null)

  const filtered = activeCategory === 'All' ? photos : photos.filter((p) => p.category === activeCategory)

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[#1A4D8F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#F5C518] text-sm font-semibold tracking-widest uppercase">Gallery</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Zambia Through Our Lens
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            A glimpse into the landscapes, communities, cultures, and experiences that make our programs unforgettable.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#1A4D8F] text-white shadow-sm'
                    : 'bg-[#f4f4f4] text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightbox(photo)}
              >
                <img
                  src={photo.thumb}
                  alt={photo.caption}
                  className="w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <span className="text-white text-sm font-medium">{photo.caption}</span>
                    <ZoomIn className="w-5 h-5 text-white flex-shrink-0" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#F5C518] text-[#1A4D8F] text-xs font-semibold px-2 py-1 rounded-full">
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white hover:text-[#F5C518] transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <p className="text-white text-center mt-3 text-sm">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </main>
  )
}
