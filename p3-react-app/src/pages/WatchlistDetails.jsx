import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getWatchlistById, removeMovieFromWatchlist } from '../api/watchlistService';
import { ArrowLeft, Trash2, Star, CalendarDays, Film } from 'lucide-react';
import { PageLoader } from '../components/Spinner';

function MovieItem({ movie, onRemove }) {
  const date       = movie.releaseDate ? new Date(movie.releaseDate) : null;
  const year       = date ? date.getFullYear() : '—';
  const starRating = (movie.voteAverage / 2).toFixed(1);
  const imageUrl   = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : '/No-Image-Placeholder.svg';

  return (
    <div className='wld-card'>
      <button
        className='wld-card__remove'
        onClick={() => onRemove(movie._id)}
        aria-label={`Remove ${movie.title}`}
      >
        <Trash2 size={13} strokeWidth={2} />
      </button>

      <Link to={`/movie/${movie.tmdbId}`} className='wld-card__link'>
        <img src={imageUrl} alt={movie.title} className='wld-card__poster' loading='lazy' />
        <div className='wld-card__overlay'>
          <p className='wld-card__title'>{movie.title}</p>
          <div className='wld-card__meta'>
            <span className='wld-card__badge wld-card__badge--star'>
              <Star size={10} strokeWidth={0} style={{ fill: '#f5c842' }} />
              {starRating}
            </span>
            <span className='wld-card__badge wld-card__badge--year'>
              <CalendarDays size={10} strokeWidth={1.75} />
              {year}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function WatchlistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [watchlist, setWatchlist]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [confirmModal, setConfirm]  = useState({ open: false, movieId: null });

  const fetchDetails = useCallback(async () => {
    try {
      const data = await getWatchlistById(id);
      setWatchlist(data.watchlist);
    } catch (error) {
      console.error(error);
      if (error.message.includes('401')) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleRemove = (movieId) => setConfirm({ open: true, movieId });

  const confirmRemove = async () => {
    try {
      await removeMovieFromWatchlist(id, confirmModal.movieId);
      fetchDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirm({ open: false, movieId: null });
    }
  };

  if (loading)    return <PageLoader />;
  if (!watchlist) return <div className='detail-error'>Watchlist not found.</div>;

  const movies = watchlist.movies || [];

  return (
    <main className='wld-page'>
      {confirmModal.open && (
        <div className='modal-backdrop'>
          <div className='modal'>
            <h2 className='modal__title'>Remove film?</h2>
            <p className='modal__body'>It will be removed from this list.</p>
            <div className='modal__actions'>
              <button className='movy-btn movy-btn--danger' onClick={confirmRemove}>Remove</button>
              <button
                className='movy-btn movy-btn--ghost'
                onClick={() => setConfirm({ open: false, movieId: null })}
              >
                Cancel
              </button> 
            </div>
          </div>
        </div>
      )}

      <div className='wld-inner'>
        <button className='detail-back' onClick={() => navigate(-1)}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </button>

        <div className='wld-header'>
          <h1 className='wld-title'>{watchlist.name}</h1>
          <span className='wld-count'>{movies.length} {movies.length === 1 ? 'film' : 'films'}</span>
        </div>

        {movies.length === 0 ? (
          <div className='wl-empty'>
            <Film size={40} strokeWidth={1.25} className='wl-empty__icon' />
            <p className='wl-empty__heading'>Nothing here yet</p>
            <p className='wl-empty__sub'>Browse movies and add them to this list.</p>
          </div>
        ) : (
          <div className='wld-grid'>
            {movies.map(movie => (
              <MovieItem key={movie._id} movie={movie} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}