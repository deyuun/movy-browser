import { useEffect, useState } from 'react'
import ScrollTopButton from '../components/ScrollTopButton'
import NowPlaying from './NowPlaying'
import Popular from './Popular'
import { PageLoader } from '../components/Spinner';

export default function Home() {
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    
    <main className='py-10 min-h-screen'>
      <header>
        <p className='text-lg text-center text-gray-400 italic'>
          Today is {currentDate}</p>
      </header>

      {loading ? (
          <PageLoader />
        ) : (
          <>
            <section>
              <NowPlaying />
            </section>

            <section>
              <Popular />
            </section>
          </>
        )}

      <ScrollTopButton />
    </main>
    
  )
}