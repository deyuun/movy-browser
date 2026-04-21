import { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import { TrendingUp } from 'lucide-react';

export default function Popular() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function getPopularMovies() {
      try {
        const data = await fetchPopularMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    }
    getPopularMovies();
  }, []);
  return (
    <div className='p-4 text-white text-3xl'>
      <h1 className='font-bold text-center mb-5 flex items-center justify-center gap-2'>
        <TrendingUp size={28} className="text-orange-400" />
        Popular
      </h1>
      <MovieGrid movies={movies}/>
    </div>
  );
}