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
    <main className='page-wrapper'>
      <div className='section-header'>
        <CalendarDays size={20} strokeWidth={1.75} className='section-header__icon' />
        <h1 className='section-title'>Upcoming Movies</h1>
      </div>
        
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
      
    </main>
  );
}