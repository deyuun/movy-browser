import { Link } from 'react-router';
import { Clapperboard } from 'lucide-react';
import Navbar from './Navbar';

export default function Header({ token, setToken }) {
  return (
    <header className='movy-header'>
      <div className='movy-header__logo-group'>
        <Link to='/' className='movy-header__logo-link'>
          <div className='movy-header__logo-icon'>
            <Clapperboard size={18} strokeWidth={1.75} />
          </div>
          <span className='movy-header__wordmark'>
            Movy<span className='movy-header__wordmark-dot'>.</span>
          </span>
        </Link>
      </div>

      <Navbar token={token} setToken={setToken} />
    </header>
  );
}