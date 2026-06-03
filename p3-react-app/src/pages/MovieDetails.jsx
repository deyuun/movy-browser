  import { useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router';
  import { fetchMovieDetails, fetchMovieProviders, fetchMovieTrailers } from '../services/movieService';
  import { addMovieToWatchlist, getUserWatchlist, syncMovieToBackend } from '../api/watchlistService';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  import { Play, Plus } from 'lucide-react';
import TrailerModal from '../components/TrailerModal';

  export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [watchlists, setWatchlist] = useState([]);
    const [addingToWatchlist, setAddingToWatchlist] = useState(false);
    const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);
    const [toast, setToast] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);

    const [trailers, setTrailers] = useState([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [activeTrailerIndex, setActiveTrailerIndex] = useState(0);

    useEffect(() => {
      if (!toast) return; 
        const time = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(time);
      
    }, [toast])

    useEffect(() => {
      async function fetchDetails(id) {
        try {
          const movieData = await fetchMovieDetails(id);
          setMovie(movieData); // show movie immediately

          // fetch providers + watchlist in background
          Promise.all([
            fetchMovieProviders(id).then(data => setProviders(data || [])),
            fetchMovieTrailers(id).then(data => setTrailers(data || [])),
            localStorage.getItem('token')
              ? getUserWatchlist().then(data => setWatchlist(data.watchlists || []))
              : Promise.resolve(),
          ]);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false); 
        }
      }

      if (id) fetchDetails(id);
    }, [id]);

    const handleAddToWatchlist = async (watchlistId) => {
      setAddingToWatchlist(true);

      try {
        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          posterPath: movie.poster_path,
          voteAverage: movie.vote_average
        }

        const syncedMovie = await syncMovieToBackend(movieData);
        const movieId = syncedMovie.movie._id;

        await addMovieToWatchlist(watchlistId, movieId);

        setToast('Movie added to watchlist!');
        setToastVisible(true);

        setTimeout(() => {
          setToastVisible(false);
        }, 3000)
        
      } catch (error) {
        console.error('Error adding to watchlist:', error);
        
        const message = error?.response?.data?.message || error?.message || 'Failed to add movie to watchlist';

        setToast(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      } finally {
        setAddingToWatchlist(false);
        setShowWatchlistMenu(false);
      }
    } 
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-xl">
          Loading...
        </div>
      );
    }

    if (!movie) return <div className="text-white text-center">Movie not found</div>;
    
    return (
      <div
        className="min-h-screen bg-gray-900 p-4 text-white relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay',
        }}
      >
        {showTrailer && trailers.length > 0 && (
          <TrailerModal 
            trailers={trailers}
            onClose={() => {setShowTrailer(false); setActiveTrailerIndex(0);}}
            activeIndex={activeTrailerIndex}
            setActiveIndex={setActiveTrailerIndex}
          />
        )}
        <div className="p-4 text-white max-w-4xl mx-auto">
          {/* ── title row ── */}
          <div className="flex flex-col mb-4">
            <h1 className="text-3xl font-bold">{movie.title}</h1>

            <div className='flex items-center gap-3 mt-3 flex-wrap'>
             {localStorage.getItem('token') && (
              <div className="relative">
                <button
                  onClick={() => setShowWatchlistMenu(!showWatchlistMenu)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  disabled={addingToWatchlist}
                >
                  <Plus size={20} />
                  Add to Watchlist
                </button>
                
                {showWatchlistMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl/30 z-10 max-h-64 overflow-y-auto">
                    {watchlists.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        <p className="mb-2">No watchlists yet</p>
                        <button
                          onClick={() => navigate('/watchlists')}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          Create one
                        </button>
                      </div>
                    ) : (
                      watchlists.map((watchlist) => (
                        <button
                          key={watchlist._id}
                          onClick={() => handleAddToWatchlist(watchlist._id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-700 transition flex items-center justify-between"
                          disabled={addingToWatchlist}
                        >
                          <span>{watchlist.name}</span>
                          <span className="text-sm text-gray-400">
                            {watchlist.movies?.length || 0} movies
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
          
          <div className='relative'>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-104 rounded-md mb-4 shadow-lg mx-auto"
            />

            {toast && (
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-950/90 p-4 rounded-lg border border-purple-700 text-white max-w-sm text-center transition-opacity duration-300 z-50 ${
                  toastVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {toast}
              </div>
            )}

            {/* watch trailer button */}
            <div className='flex justify-center mb-6'>
              {trailers.length > 0 && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-semibold"
                  >
                    <Play size={18} className='fill-white' />
                    Watch Trailer
                  </button>
              )}
             </div>
          </div>

          <p className="mb-10 text-3xl text-gray-300">{movie.tagline}</p>
          <p className="mb-2 text-gray-200">
            <strong className="text-xl">Storyline: <br /></strong>
            {movie.overview}
          </p>
          <p className="mb-2 text-gray-300">
            <strong>Release Date: </strong>
            {new Date(movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p>
            <strong>Runtime:</strong> {movie.runtime} minutes
          </p>
          <p>
            <strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
          </p>

          {providers?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Available On:</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {providers.map((provider) => (
                  <div
                    key={provider.provider_id}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={provider.logo_path ? `https://image.tmdb.org/t/p/w45${provider.logo_path}` : '/No-Image-Placeholder.svg'}
                      alt={provider.provider_name || 'Unknown Provider'}
                    />
                    <span className="text-sm mt-4">{provider.provider_name || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mb-2 mt-5 px-4 py-2 text-white rounded hover:!bg-gray-600 transition"
          >
            ← Back
          </button>
        </div>
      </div>
  );
  }