import { TrendingUp } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import { PageLoader } from '../components/Spinner';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchPopularMovies } from '../services/movieService';

export default function PopularPage() {
  const { movies, loading, loadingMore, hasMore, sentinelRef } =
    useInfiniteScroll(fetchPopularMovies, []);

  return (
    <main className='page-wrapper'>
      <div className='section-header'>
        <TrendingUp size={20} strokeWidth={1.75} className='section-header__icon' />
        <h1 className='section-title'>Popular</h1>
      </div>

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
    </main>
  );
}