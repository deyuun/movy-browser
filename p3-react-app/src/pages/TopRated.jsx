import { Star } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import { PageLoader } from '../components/Spinner';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchTopRatedMovies } from '../services/movieService';

export default function TopRated() {
  const { movies, loading, loadingMore, hasMore, sentinelRef } =
    useInfiniteScroll(fetchTopRatedMovies, []);

  return (
    <main className='page-wrapper'>
      <div className='section-header'>
        <Star size={20} strokeWidth={1.75} className='section-header__icon' />
        <h1 className='section-title'>Top rated</h1>
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