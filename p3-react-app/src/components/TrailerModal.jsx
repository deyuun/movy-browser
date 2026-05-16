import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * TrailerModal
 *
 * Props:
 *   trailers  - array from fetchMovieTrailers()
 *   onClose   - () => void
 *
 * Shows the first trailer by default. If there are multiple trailers,
 * a small tab row lets the user switch between them.
 */
export default function TrailerModal({ trailers, onClose, activeIndex, setActiveIndex }) {
  const trailer = trailers[activeIndex];

  // close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()} // don't close when clicking the modal itself
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          aria-label="Close trailer"
        >
          <X size={28} />
        </button>

        {/* trailer tabs (only shown when there are multiple trailers) */}
        {trailers.length > 1 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {trailers.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(i)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  i === activeIndex
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {t.name || `Trailer ${i + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* 16:9 responsive iframe */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            key={trailer.key} // remount iframe when switching trailers
            className="absolute inset-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}