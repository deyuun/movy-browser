import { Link } from 'react-router';
import { Star, Calendar } from 'lucide-react';

export default function MovieCard({movie}) {

  const date = movie.release_date ? new Date(movie.release_date) : null;
  const year = date ? date.getFullYear() : '-';
  const starRating = (movie.vote_average / 2).toFixed(1);
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/No-Image-Placeholder.svg';

  return (
    <Link to={`/movie/${movie.id}`} className='movie-card' tabIndex={0}>
      <div className='movie-card__poster-wrap'>
        <img
          src={imageUrl}
          alt={movie.title}
          className='movie-card__poster'
          loading='lazy' 
        />
        <div className='movie-card__overlay'>
          <h2 className='movie-card__title'>movie.title</h2>
          <div className='movie-card__meta'>
            <span className='movie-card__badge movie-card__badge--start'>
              <Star size={11} strokeWidth={0} className='movie-card__star-icon'/>
              {starRating}
            </span>
            <span className='movie-card__badge movie-card__badge-year'>
              <Calendar size={11} strokeWidth={1.75}/>
              {year}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}