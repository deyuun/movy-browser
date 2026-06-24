import { fetchPopularMovies } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import { TrendingUp } from 'lucide-react';
import { PageLoader } from '../components/Spinner';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import { useEffect, useState } from 'react';

export default function Popular() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchPopularMovies(1)
    .then(data => setMovies(data.results.slice(0,10)))
    .catch(console.error)
    .finally(() => setLoading(false));
  })
  
  return (
    <div className='section-block'>
      <div className='section-header'>
        <TrendingUp size={20}  strokeWidth={1.75} className="section-header__icon" />
        
        <h2 className='section-title'>Popular</h2>
        <Link to='/' className='section-see-all'>
          See all <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {loading ? <PageLoader /> : <MovieGrid movies={movies} />}
    </div>
  );
}