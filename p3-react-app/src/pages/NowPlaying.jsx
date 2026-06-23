import { Film } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import { PageLoader } from '../components/Spinner';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchNowPlayingMovies } from '../services/movieService';

export default function NowPlaying() {
  const { movies, loading, loadingMore, hasMore, sentinelRef } =
    useInfiniteScroll(fetchNowPlayingMovies, []);

  return (
    <div className='section-block'>
      <div className='section-header'>
        <Film size={20} strokeWidth={1.75} className='section-header__icon' />
        <h2 className='section-title'>Now playing</h2>
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
    </div>
  );
}