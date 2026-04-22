const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function tmdbGet(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB error on ${path}: ${response.status}`);
  }
  return response.json();
}

export async function fetchPopularMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies'); 
  }
  const data = await response.json();
  return data.results;
  
}

export async function fetchNowPlayingMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch now playing movies');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchTopRatedMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchUpcomingMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchMovieDetails(id) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  const data = await response.json();
  return data
}

export async function fetchMovieProviders(id, country='PH') {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`)
  if (!response.ok) {
    throw new Error('Failed to fetch Movie Providers');
  }
  const data = await response.json();
  console.log('PH:', data.results?.['PH']?.flatrate);
  console.log('US:', data.results?.['US']?.flatrate);
  let providers = data.results?.[country];
  if(!providers || !providers.flatrate || providers.flatrate.length === 0) {
    providers = data.results['US'];
  }

  if (providers && providers.flatrate) {
    return providers.flatrate;
  }
  console.warn('No flatrate providers found for this movie');
  return [];
}

export async function fetchTrendingMovies(timeSetting = 'day') {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/${timeSetting}?api_key=${API_KEY}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies for ${timeSetting}`);
  }
  const data = await response.json();
  return data.results;
}
