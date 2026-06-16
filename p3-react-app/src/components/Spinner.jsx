export default function Spinner({ size = 'lg' }) {
  const px = {sm: 24, lg: 40, xl: 52, xxl: 72}[size] ?? 40;

  return (
    <div
      className='spinner'
      style={{width: px, height: px}}
      role='status'
      aria-label='Loading'
    />
  )
}

export function PageLoader() {
  return (
    <div className='page-loader'>
      <Spinner size='xxl'/>
    </div>
  )
}

export function WatchlistCardSkeleton() {
  return (
    <li
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        minHeight: 140,
        animation: 'pulse 1.6s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 20, borderRadius: 6, background: 'var(--bg-hover)', marginBottom: 8 }} />
          <div style={{ height: 14, borderRadius: 6, background: 'var(--bg-hover)', width: '55%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-hover)' }} />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-hover)' }} />
        </div>
      </div>
    </li>
  );
}


export function WatchlistGridLoader({ count = 3}) {
  return (
    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <WatchlistCardSkeleton key={i} />
      ))}
    </ul>
  )
}