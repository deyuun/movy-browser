import { fetchUpcomingMovies } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import { PageLoader } from '../components/Spinner';
import { CalendarDays } from 'lucide-react';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

export default function Upcoming() {
  const { movies, loading, loadingMore, hasMore, sentinelRef } =
    useInfiniteScroll(fetchUpcomingMovies, []);
  
  return (
    <main className='py-10 min-h-screen'>
      <div className='p-4 text-white'>
        <h1 className='font-bold text-center mb-6 text-3xl flex items-center justify-center gap-2'>
          <CalendarDays size={28} className='text-blue-400' />
          Upcoming Movies
        </h1>
        
        {loading ? 
          (
            <PageLoader />
          ) : (
            <>
              <MovieGrid movies={movies}/>
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