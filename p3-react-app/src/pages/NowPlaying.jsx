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
    <div className='p-4 text-white text-3xl'>
      <h1 className='font-bold text-center mb-5 flex items-center justify-center gap-2'>
        <Film size={28} className="text-purple-400" />
        Now Playing
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