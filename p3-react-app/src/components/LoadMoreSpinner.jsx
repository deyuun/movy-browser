export default function LoadMoreSpinner({ loadingMore, hasMore, sentinelRef }) {
  return (
    <div ref={sentinelRef} className='flex justify-center items-center py-10'>
      {loadingMore && (
        <div className='flex flex-col items-center gap-2'> 
          <div className='w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin'/>

          <span className='text-gray-400 text-sm'>Loading more...</span>
        </div>
      )}
      {!hasMore && !loadingMore && (
        <p className='text-gray-500 text-sm'>You've reached the end</p>
      )}
    </div>
  )
}