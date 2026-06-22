import ScrollTopButton from '../components/ScrollTopButton'
import NowPlaying from './NowPlaying'
import Popular from './Popular'

export default function Home() {

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    
    <main className='home-page'>
      <div className='home-date'>{currentDate}</div>
      <section className='home-section'>
        <NowPlaying />
      </section>

      <section className='home-section'>
        <Popular />
      </section>
      <ScrollTopButton />
    </main>
    
  )
}