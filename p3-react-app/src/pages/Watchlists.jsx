import { useCallback, useEffect, useState } from 'react';
import { createWatchlist, deleteWatchlist, getUserWatchlist, renameWatchlist } from '../api/watchlistService';
import { useNavigate } from 'react-router';
import { Plus, Pencil, X, Check, Film } from 'lucide-react';
import { PageLoader, WatchlistGridLoader } from '../components/Spinner';

export default function Watchlists() {
  const [watchlists, setWatchlists]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [isCreating, setIsCreating]           = useState(false);
  const [newLabel, setNewLabel]               = useState('');
  const [editId, setEditId]                   = useState(null);
  const [editLabel, setEditLabel]             = useState('');
  const [toast, setToast]                     = useState(null);
  const [confirmModal, setConfirmModal]       = useState({ open: false, watchlistId: null });
  const navigate = useNavigate();

  const fetchWatchlists = useCallback(async () => {
    try {
      const data = await getUserWatchlist();
      setWatchlists(data.watchlists || []);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403')) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchWatchlists(); }, [fetchWatchlists]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    try {
      await createWatchlist(newLabel.trim());
      setToast('Watchlist created');
      setNewLabel('');
      setIsCreating(false);
      await fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWatchlist(id);
      setToast('Watchlist deleted');
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id) => {
    if (!editLabel.trim()) return;
    try {
      await renameWatchlist(id, editLabel.trim());
      setToast('Watchlist renamed');
      setEditId(null);
      setEditLabel('');
      await fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className='wl-page'>
      {/* confirm delete modal */}
      {confirmModal.open && (
        <div className='modal-backdrop'>
          <div className='modal'>
            <h2 className='modal__title'>Delete watchlist?</h2>
            <p className='modal__body'>This can't be undone.</p>
            <div className='modal__actions'>
              <button
                className='movy-btn movy-btn--danger'
                onClick={async () => {
                  await handleDelete(confirmModal.watchlistId);
                  setConfirmModal({ open: false, watchlistId: null });
                }}
              >
                Delete
              </button>
              <button
                className='movy-btn movy-btn--ghost'
                onClick={() => setConfirmModal({ open: false, watchlistId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && <div className='page-toast'>{toast}</div>}

      <div className='wl-inner'>
        <div className='wl-header'>
          <h1 className='wl-header__title'>Your watchlists</h1>

          {!isCreating ? (
            <button className='movy-btn movy-btn--primary' onClick={() => setIsCreating(true)}>
              <Plus size={15} strokeWidth={2.5} />
              New list
            </button>
          ) : (
            <form onSubmit={handleCreate} className='wl-create-form'>
              <input
                autoFocus
                type='text'
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder='List name…'
                className='wl-create-input'
              />
              <button type='submit' className='movy-btn movy-btn--primary'>Create</button>
              <button
                type='button'
                className='movy-btn movy-btn--ghost'
                onClick={() => { setIsCreating(false); setNewLabel(''); }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {loading ? (
          <WatchlistGridLoader count={6} />
        ) : watchlists.length === 0 ? (
          <div className='wl-empty'>
            <Film size={40} strokeWidth={1.25} className='wl-empty__icon' />
            <p className='wl-empty__heading'>No lists yet</p>
            <p className='wl-empty__sub'>Create a list and add movies from any film page.</p>
          </div>
        ) : (
          <ul className='wl-grid'>
            {watchlists.map(list => (
              <li key={list._id} className='wl-card'>
                {editId === list._id ? (
                  <form
                    onSubmit={e => { e.preventDefault(); handleRename(list._id); }}
                    className='wl-card__rename-form'
                  >
                    <input
                      autoFocus
                      type='text'
                      value={editLabel}
                      onChange={e => setEditLabel(e.target.value)}
                      onFocus={e => e.target.select()}
                      className='wl-create-input'
                    />
                    <button type='submit' className='wl-card__icon-btn wl-card__icon-btn--confirm' aria-label='Save'>
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      type='button'
                      className='wl-card__icon-btn'
                      aria-label='Cancel'
                      onClick={() => { setEditId(null); setEditLabel(''); }}
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </form>
                ) : (
                  <div
                    className='wl-card__body'
                    onClick={() => navigate(`/watchlists/${list._id}`)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/watchlists/${list._id}`)}
                  >
                    {/* mini poster strip */}
                    <div className='wl-card__strip'>
                      {Array.from({ length: 4 }).map((_, i) => {
                        const m = list.movies?.[i];
                        return (
                          <div key={i} className='wl-card__strip-slot'>
                            {m?.posterPath && (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${m.posterPath}`}
                                alt=''
                                className='wl-card__strip-img'
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className='wl-card__info'>
                      <span className='wl-card__name'>{list.name}</span>
                      <span className='wl-card__count'>
                        {list.movies?.length ?? 0} {list.movies?.length === 1 ? 'film' : 'films'}
                      </span>
                    </div>
                  </div>
                )}

                {editId !== list._id && (
                  <div className='wl-card__actions'>
                    <button
                      className='wl-card__icon-btn'
                      aria-label='Rename'
                      onClick={e => {
                        e.stopPropagation();
                        setEditId(list._id);
                        setEditLabel(list.name);
                      }}
                    >
                      <Pencil size={13} strokeWidth={2} />
                    </button>
                    <button
                      className='wl-card__icon-btn wl-card__icon-btn--delete'
                      aria-label='Delete'
                      onClick={e => {
                        e.stopPropagation();
                        setConfirmModal({ open: true, watchlistId: list._id });
                      }}
                    >
                      <X size={13} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}