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
    <main className='py-10 min-h-screen'>
      <div className='p-4 text-white'>
        <h1 className='font-bold text-center mb-6 text-3xl flex items-center justify-center gap-2'>
          <Star size={28} className="text-yellow-400 fill-yellow-400" />
          Top Rated Movies
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
    </main>
  );
}