import { Routes, Route } from 'react-router';
import Home from '../pages/Home';
import TopRated from '../pages/TopRated';
import Upcoming from '../pages/Upcoming';
import MovieDetails from '../pages/MovieDetails';
import Trending from '../pages/Trending';
import Search from '../components/Search';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Watchlists from '../pages/Watchlists';
import WatchlistDetails from '../pages/WatchlistDetails';
import NowPlayingPage from '../pages/NowPlayingPage';
import Popular from '../pages/Popular';
import PopularPage from '../pages/Popularpage';



const AppRoutes = ({setToken}) => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/now-playing' element={<NowPlayingPage />}/>
      <Route path='/popular' element={<PopularPage />}/>
      <Route path='/top-rated' element={<TopRated />} />
      <Route path='/upcoming' element={<Upcoming />} />
      <Route path='/movie/:id' element={<MovieDetails />} />
      <Route path='/trending' element={<Trending />} />
      <Route path="/search" element={<Search />} />
      <Route path='/login' element={<Login setToken={setToken}/>} />
      <Route path='/register' element={<Register setToken={setToken}/>} />
      <Route path='/watchlists' element={<Watchlists />} />
      <Route path='/watchlists/:id' element={<WatchlistDetails />} />
    </Routes>
  )
}

export default AppRoutes;