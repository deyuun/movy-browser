import { Film } from 'lucide-react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchNowPlayingMovies } from '../services/movieService';
import { PageLoader } from '../components/Spinner';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import MovieGrid from '../components/MovieGrid';

export default function NowPlayingPage() {
  const {movies, loading, loadingMore, hasMore, sentinelRef} = useInfiniteScroll(fetchNowPlayingMovies, []);

  return (
    <main className='page-wrapper'>
      <div className='section-header'>
        <Film size={20} strokeWidth={1.75} className='section-header__icon'/>
        <h1 className='section-title'>Now Playing</h1>
      </div>

      {loading ? (
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
  )
}