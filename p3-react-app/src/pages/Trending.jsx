import { useCallback, useState } from 'react';
import { Flame } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import LoadMoreSpinner from '../components/LoadMoreSpinner';
import TimeToggle from '../components/TimeToggle';
import { PageLoader } from '../components/Spinner';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchTrendingMovies } from '../services/movieService';
import ScrollTopButton from '../components/ScrollTopButton';

export default function Trending() {
  const [timeSetting, setTimeSetting] = useState('day');

  // Wrap in useCallback so the hook gets a stable reference per timeSetting.
  // When timeSetting changes a new function reference is created, which
  // triggers the reset inside useInfiniteScroll via the deps array.
  const fetcher = useCallback(
    (page) => fetchTrendingMovies(timeSetting, page),
    [timeSetting]
  );

  const { movies, loading, loadingMore, hasMore, sentinelRef } =
    useInfiniteScroll(fetcher, [timeSetting]);

  return (
    <main className='py-10 min-h-screen'>
      <div className='p-4 text-white'>
        <h1 className='font-bold text-center mb-2 text-3xl flex items-center justify-center gap-2'>
          <Flame size={28} className="text-purple-400" />
          Trending
        </h1>

        <TimeToggle timeSetting={timeSetting} setTimeSetting={setTimeSetting} />

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
      <ScrollTopButton />
    </main>
  );
}