import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Film, ArrowRight } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { PageLoader } from '../components/Spinner';
import { fetchNowPlayingMovies } from '../services/movieService';

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNowPlayingMovies(1);
        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className='section-block'>
      <div className='section-header'>
        <Film size={20} strokeWidth={1.75} className='section-header__icon' />
        <h2 className='section-title'>Now playing</h2>
        <Link to='/now-playing' className='section-see-all'>
          See all <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {loading ? <PageLoader /> : <MovieGrid movies={movies} />}
    </div>
  );
}