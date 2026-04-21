import { useEffect, useState } from 'react';
import { fetchTrendingMovies } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import TimeToggle from '../components/TimeToggle';
import { PageLoader } from '../components/Spinner';
import { Flame } from 'lucide-react';

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [timeSetting, setTimeSetting] = useState('day');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getTrendingMovies() {
      try {
        const data = await fetchTrendingMovies(timeSetting);
        setMovies(data);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    }
    getTrendingMovies();
  }, [timeSetting]);
  return (
    <main className='py-10 min-h-screen'>
      <div className='p-4 text-white'>
        <h1 className='font-bold text-center mb-2 text-3xl flex items-center justify-center gap-2'>
          <Flame size={28} className="text-purple-400" />
          Trending
        </h1>
        <TimeToggle timeSetting={timeSetting} setTimeSetting={setTimeSetting}/>
        
        {loading ? (
          <PageLoader />
        ) : (
          <MovieGrid movies={movies} />
        )}
      </div>
    </main>
  );
}