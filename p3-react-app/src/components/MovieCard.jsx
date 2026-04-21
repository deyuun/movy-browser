import { Link } from 'react-router';
import { Star, Calendar } from 'lucide-react';

export default function MovieCard({movie}) {

  const date = new Date(movie.release_date);
  const month = date.toLocaleDateString('default', {month: 'short'});
  const year = date.getFullYear();
  const releaseDate = `${month} ${year}`; 

  let imageUrl;
  if (movie.poster_path) {
    imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }
  else {
    imageUrl = '/No-Image-Placeholder.svg';
  }

  const starRating = (movie.vote_average / 2).toFixed(1);
  return (
  <Link to={`/movie/${movie.id}`} className='block'>
    <div className='bg-gray-800 text-white rounded shadow p-4 flex flex-col justify-between h-full hover:scale-105 transition-transform'>
      <img
      src={imageUrl}
      alt={movie.title}
      className='rounded mb-2'
      />
      <div className='flex flex-col flex-grow items-center justify-center text-center'>
        <div>
          <h2 className='text-lg font-semibold text-center mb-2'>{movie.title}</h2>

          <p className="text-sm text-gray-300 flex justify-center items-center gap-2 mt-auto">
              <span className="bg-gray-700 px-2 py-0.5 mt-2 rounded-full flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                {starRating}
              </span>
            <span className="bg-gray-700 px-2 py-0.5 mt-2 rounded-full flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                {releaseDate}
            </span>
          </p>
        </div>
      </div>
    </div>
    </Link>
  )
}