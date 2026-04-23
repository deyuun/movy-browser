import { useCallback, useEffect, useRef, useState } from 'react';

export default function useInfiniteScroll(fetcher, deps = []) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // this is first load
  const [loading, setLoading] = useState(true);
  // subsequent loads
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const hasMore = page <= totalPages;

  const loadPage = useCallback(async (pageNum, isFirst) => {
    try {
      isFirst ? setLoading(true) : setLoadingMore(true);
      const data = await fetcher(pageNum);
      setMovies(prev => isFirst ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (error) {
      setError(error.message);
    } finally {
      isFirst ? setLoading(false) : setLoadingMore(false);
    }
  }, [fetcher]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
    loadPage(1, true);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page === 1) return; // first page handled above
    loadPage(page, false);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          setPage(prev => prev + 1)
        }
      },
      { rootMargin: '200px'} // start loading 200 px before sentinel hits viewport
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, loadingMore, hasMore])

  return { movies, loading, loadingMore, hasMore, sentinelRef, error}
}