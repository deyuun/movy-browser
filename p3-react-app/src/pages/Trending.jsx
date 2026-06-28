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
    <main className='page-wrapper'>
      <div className='section-header'>
        <Flame size={20} strokeWidth={1.75} className='section-header__icon' />
        <h1 className='section-title'>Trending</h1>
      </div>

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

      <ScrollTopButton />
    </main>
  );
}