import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchMovieDetails, fetchMovieProviders, fetchMovieTrailers } from '../services/movieService';
import { addMovieToWatchlist, getUserWatchlist, syncMovieToBackend } from '../api/watchlistService';
import { Play, Plus, ArrowLeft, Clock, Star, CalendarDays, ChevronDown } from 'lucide-react';
import TrailerModal from '../components/TrailerModal';
import { PageLoader } from '../components/Spinner';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie]                   = useState(null);
  const [providers, setProviders]           = useState([]);
  const [trailers, setTrailers]             = useState([]);
  const [watchlists, setWatchlists]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [addingToWatchlist, setAdding]         = useState(false);
  const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);
  const [showTrailer, setShowTrailer]          = useState(false);
  const [activeTrailerIndex, setActiveIdx]  = useState(0);
  const [toast, setToast]                   = useState(null);
  const [toastVisible, setToastVisible]     = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    async function load() {
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);
        Promise.all([
          fetchMovieProviders(id).then(d => setProviders(d || [])),
          fetchMovieTrailers(id).then(d => setTrailers(d || [])),
          localStorage.getItem('token')
            ? getUserWatchlist().then(d => setWatchlists(d.watchlists || []))
            : Promise.resolve(),
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleAddToWatchlist = async (watchlistId) => {
    setAdding(true);
    try {
      const synced = await syncMovieToBackend({
        tmdbId:      movie.id,
        title:       movie.title,
        releaseDate: movie.release_date,
        overview:    movie.overview,
        posterPath:  movie.poster_path,
        voteAverage: movie.vote_average,
      });
      await addMovieToWatchlist(watchlistId, synced.movie._id);
      setToast('Added to watchlist');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (err) {
      const msg = err?.message || 'Failed to add movie';
      setToast(msg);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } finally {
      setAdding(false);
      setShowWatchlistMenu(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!movie)  return <div className='detail-error'>Movie not found.</div>;

  const starRating   = (movie.vote_average / 2).toFixed(1);
  const releaseDate  = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';
  const runtime     = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className='detail-page'>
      {/* backdrop */}
      {movie.backdrop_path && (
        <div className='detail-backdrop'>
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=''
            className='detail-backdrop__img'
          />
          <div className='detail-backdrop__gradient' />
        </div>
      )}

      {/* trailer modal */}
      {showTrailer && trailers.length > 0 && (
        <TrailerModal
          trailers={trailers}
          onClose={() => { setShowTrailer(false); setActiveIdx(0); }}
          activeIndex={activeTrailerIndex}
          setActiveIndex={setActiveIdx}
        />
      )}

      {/* toast */}
      {toast && (
        <div className={`detail-toast${toastVisible ? ' detail-toast--visible' : ''}`}>
          {toast}
        </div>
      )}

      <div className='detail-inner'>
        {/* back */}
        <button className='detail-back' onClick={() => navigate(-1)}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>

        <div className='detail-layout'>
          {/* poster */}
          <div className='detail-poster-col'>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/No-Image-Placeholder.svg'
              }
              alt={movie.title}
              className='detail-poster'
            />
          </div>

          {/* info */}
          <div className='detail-info'>
            {/* genres */}
            {movie.genres?.length > 0 && (
              <div className='detail-genres'>
                {movie.genres.map(g => (
                  <span key={g.id} className='detail-genre-tag'>{g.name}</span>
                ))}
              </div>
            )}

            <h1 className='detail-title'>{movie.title}</h1>

            {movie.tagline && (
              <p className='detail-tagline'>"{movie.tagline}"</p>
            )}

            {/* stats row */}
            <div className='detail-stats'>
              <span className='detail-stat detail-stat--star'>
                <Star size={14} strokeWidth={0} style={{ fill: '#f5c842' }} />
                {starRating}
              </span>
              <span className='detail-divider' />
              <span className='detail-stat'>
                <CalendarDays size={14} strokeWidth={1.75} />
                {releaseDate}
              </span>
              {runtime && (
                <>
                  <span className='detail-divider' />
                  <span className='detail-stat'>
                    <Clock size={14} strokeWidth={1.75} />
                    {runtime}
                  </span>
                </>
              )}
            </div>

            {/* actions */}
            <div className='detail-actions'>
              {trailers.length > 0 && (
                <button className='detail-btn detail-btn--trailer' onClick={() => setShowTrailer(true)}>
                  <Play size={15} strokeWidth={0} style={{ fill: '#fff' }} />
                  Watch trailer
                </button>
              )}

              {localStorage.getItem('token') && (
                <div className='detail-watchlist-wrap'>
                  <button
                    className='detail-btn detail-btn--watchlist'
                    onClick={() => setShowWatchlistMenu(v => !v)}
                    disabled={addingToWatchlist}
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add to watchlist
                    <ChevronDown size={13} strokeWidth={2} />
                  </button>

                  {showWatchlistMenu && (
                    <div className='detail-watchlist-menu'>
                      {watchlists.length === 0 ? (
                        <div className='detail-watchlist-empty'>
                          <p>No watchlists yet.</p>
                          <button
                            className='detail-watchlist-create-link'
                            onClick={() => navigate('/watchlists')}
                          >
                            Create one
                          </button>
                        </div>
                      ) : (
                        watchlists.map(wl => (
                          <button
                            key={wl._id}
                            className='detail-watchlist-item'
                            onClick={() => handleAddToWatchlist(wl._id)}
                            disabled={addingToWatchlist}
                          >
                            <span>{wl.name}</span>
                            <span className='detail-watchlist-count'>
                              {wl.movies?.length ?? 0} films
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* overview */}
            {movie.overview && (
              <div className='detail-section'>
                <h2 className='detail-section__label'>Storyline</h2>
                <p className='detail-section__body'>{movie.overview}</p>
              </div>
            )}

            {/* providers */}
            {providers.length > 0 && (
              <div className='detail-section'>
                <h2 className='detail-section__label'>Where to watch</h2>
                <div className='detail-providers'>
                  {providers.map(p => (
                    <div key={p.provider_id} className='detail-provider'>
                      <img
                        src={
                          p.logo_path
                            ? `https://image.tmdb.org/t/p/w45${p.logo_path}`
                            : '/No-Image-Placeholder.svg'
                        }
                        alt={p.provider_name}
                        className='detail-provider__logo'
                      />
                      <span className='detail-provider__name'>{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}