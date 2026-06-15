import { Link, useLocation, useNavigate } from 'react-router';
import {
  Search,
  LogOut,
  BookMarked,
  User,
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/top-rated', label: 'Top Rated' },
  { to: '/upcoming',  label: 'Upcoming'  },
  { to: '/trending',  label: 'Trending'  },
];

export default function Navbar({ token, setToken }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate   = useNavigate();
  const location   = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  }

  const isSearch = location.pathname === '/search';

  return (
    <nav className='movy-nav'>
      {/* page links */}
      <ul className='movy-nav__links'>
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={`movy-nav__link${location.pathname === to ? ' movy-nav__link--active' : ''}`}
            >
              {label}
            </Link>
          </li>
        ))}
        {token && (
          <li>
            <Link
              to='/watchlists'
              className={`movy-nav__link${location.pathname.startsWith('/watchlists') ? ' movy-nav__link--active' : ''}`}
            >
              Watchlists
            </Link>
          </li>
        )}
      </ul>

      {/* search */}
      {!isSearch && (
        <div className='movy-nav__search-wrap'>
          {searchOpen ? (
            <form onSubmit={handleSearch} className='movy-nav__search-form'>
              <Search size={14} className='movy-nav__search-icon' strokeWidth={2} />
              <input
                autoFocus
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                placeholder='Search movies…'
                className='movy-nav__search-input'
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className='movy-nav__search-trigger'
              aria-label='Open search'
            >
              <Search size={14} strokeWidth={2} />
              <span>Search</span>
            </button>
          )}
        </div>
      )}

      {/* auth */}
      <div className='movy-nav__auth'>
        {token ? (
          <>
            <Link to='/watchlists' className='movy-nav__icon-btn' aria-label='My watchlists'>
              <BookMarked size={16} strokeWidth={1.75} />
            </Link>
            <button onClick={handleLogout} className='movy-nav__icon-btn movy-nav__icon-btn--danger' aria-label='Log out'>
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='movy-btn movy-btn--ghost'>
              Login
            </Link>
            <Link to='/register' className='movy-btn movy-btn--primary'>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}