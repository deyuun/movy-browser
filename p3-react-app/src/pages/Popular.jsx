import { fetchPopularMovies } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import { TrendingUp } from 'lucide-react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { PageLoader } from '../components/Spinner';
import LoadMoreSpinner from '../components/LoadMoreSpinner';

export default function Popular() {
  const { movies, loading, loadingMore, hasMore, sentinelRef } = useInfiniteScroll(fetchPopularMovies, []);
  
  return (
    <div className='p-4 text-white text-3xl'>
      <h1 className='font-bold text-center mb-5 flex items-center justify-center gap-2'>
        <TrendingUp size={28} className="text-orange-400" />
        Popular
      </h1>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <LoadMoreSpinner 
            loadingMore={loadingMore}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
          />
        </>
      )}
    </div>
  );
}