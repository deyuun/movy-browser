import { useCallback, useEffect, useState } from 'react';
import { createWatchlist, deleteWatchlist, getUserWatchlist, renameWatchlist } from '../api/watchlistService';
import { useNavigate } from 'react-router';
import { Plus, Pencil, X } from 'lucide-react';
import { PageLoader, WatchlistGridLoader } from '../components/Spinner';

export default function Watchlists() {
  const [watchlists, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const [isCreatingWatchlist, setIsCreatingWatchlist] = useState(false);
  const [newWatchlistLabel, setNewWatchlistLabel] = useState('');

  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [toast, setToast] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    watchlistId: null,
  })


  const fetchWatchlists = useCallback(async ()  => {
      try {
        const data = await getUserWatchlist();
        setWatchlist(data.watchlists || []);
      } catch (error) {
        console.error('Error fetching watchlists:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
          navigate('/login'); 
        }
      } finally {
        setLoading(false);
      }
    }, [navigate]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  const handleCreateWatchlist = async (e) => {
    e.preventDefault()
    if (!newWatchlistLabel.trim()) {
      return;
    }

    try {
      await createWatchlist(newWatchlistLabel);
      setToast('Watchlist created!')
      setNewWatchlistLabel('');
      setIsCreatingWatchlist(false);
      await fetchWatchlists();
    } catch (error) {
      console.error('Error creating watchlist', error);
    }
  }

  const handleDeleteWatchlist = async (id) => {
    try {
      await deleteWatchlist(id);
      setToast('Your watchlist is deleted');
      fetchWatchlists();
    } catch (error) {
      console.error('Error deleting watchlist:', error)
    }
  }

  const handleRenameWatchlist = async (id) => {
    if (!editLabel.trim()) {
      return
    }

    try {
      await renameWatchlist(id, editLabel);
      setToast('Watchlist renamed!')
      setEditId(null);
      setEditLabel('');
      await fetchWatchlists();
    } catch (error) {
      console.error( error.message ||'Error renaming watchlist:', error)
    }
  }
  
  
  return (
    <main className='min-h-screen py-10'>
      <div className='max-w-6xl mx-auto px-4 text-white relative'>
        {confirmModal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className='bg-purple-950 p-6 rounded-xl shadow-xl border border-purple-700 max-w-sm w-full text-center'>
              <h2 className="text-xl font-semibold mb-2">Delete Watchlist?</h2>
              <p className='text-gray-300 mb-6'>This action cannot be undone</p>
              <div className='flex justify-center gap-4'>
                <button
                  onClick={async () => {
                    await handleDeleteWatchlist(confirmModal.watchlistId);
                    setConfirmModal({open: false, watchlistId: null});
                    
                  }}
                  
                  >
                    Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmModal({ open: false, watchlistId: null })}
                  >
                    Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {toast && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-900 px-4 py-2 rounded-lg animate-fade z-50">
              {toast}
            </div>
          )}

        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-bold mb-6'>Your Watchlists</h1>
          
          {!isCreatingWatchlist ? (
            <button onClick={() => setIsCreatingWatchlist(true)} className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition'>
              <Plus size={20}/>
              Watchlist
            </button>
          ) : (
            <form onSubmit={handleCreateWatchlist} className='mt-4 flex gap-2'>
              <input type='text' value={newWatchlistLabel}
                onChange={(e) => setNewWatchlistLabel(e.target.value)}
                placeholder='Enter watchlist name...'
                className='flex-1 min-w-0 px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500'
                autoFocus
              />
              <button type='submit' className='text-white px-4 py-2 rounded'>
                Create
              </button>

              <button
                type='button'
                onClick={() => {
                  setIsCreatingWatchlist(false);
                  setNewWatchlistLabel('')
                }}
                className='text-white px-4 py-2 rounded'
              >
                Cancel
              </button>
            </form>
          )}

        </div>

          {loading ? (
            <WatchlistGridLoader count={15}/>
          ) : watchlists.length === 0 ? (
            <p>No watchlist found. Create one from a movie page!</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {watchlists.map((list) => (
                <li
                  key={list._id}
                   className="bg-purple-950/50 p-4 rounded-lg border border-purple-700 hover:bg-purple-900/60 transition"
                >
                  {editId === list._id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRenameWatchlist(list._id)
                      }}
                      className='flex gap-2 items-center w-full'
                    >
                      <input
                        type='text'
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className='flex-1 min-w-0 px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500 '
                        autoFocus
                        onFocus={(e) => e.target.select()}
                      />
                      <button type='submit' className='text-green-400 hover:text-green-300 text-xl'>✔</button>
                      <button type='button' 
                        onClick={() => {
                          setEditId(null);
                          setEditLabel('');
                        }}
                        className='text-red-400 hover:text-red-300 text-xl'
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <div className='flex items-center'>
                      <div
                        onClick={() => navigate(`/watchlists/${list._id}`)}
                        className='cursor-pointer flex-1 text-center'
                      >
                        <h2 className='text-xl font-semibold'>{list.name}</h2>
                        <p className='text-gray-400'>{list.movies.length} movies</p>
                      </div>
                      
                      <div className='flex flex-col gap-2 ml-2'>
                        <button
                          onClick={() => {
                            setEditId(list._id);
                            setEditLabel(list.name);
                          }}
                          className='bg-purple-800/60 text-purple-200 hover:bg-purple-700 hover:text-white px-2 py-1 rounded-md transition'
                          title="Rename Watchlist"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ open: true, watchlistId: list._id })}
                          className="bg-purple-800/60 text-purple-200 hover:bg-purple-700 hover:text-white px-2 py-1 rounded-md transition"
                          title='Delete Watchlist'>
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>       
              ))}
            </ul>
          )}
        
      </div>
    </main>
  )
}