const Loading = ({ message = 'Loading...', fullScreen = true, inline = false, className = '' }) => {
  const containerHeight = fullScreen ? 'min-h-screen' : 'min-h-[240px]'
  const spinnerSize = inline ? 'h-4 w-4 border-2' : 'h-10 w-10 border-4'
  const spinnerColors = inline
    ? 'border-current/25 border-t-current'
    : 'border-slate-200 border-t-indigo-600'

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span
          className={`shrink-0 rounded-full ${spinnerSize} ${spinnerColors}`}
          style={{ animation: 'loadingSpin 0.8s linear infinite' }}
          aria-hidden='true'
        />
        {message ? <span className='text-sm font-medium text-current'>{message}</span> : null}
      </span>
    )
  }

  return (
    <div className={`flex items-center justify-center px-4 ${containerHeight} ${className}`}>
      <div className='flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 shadow-sm backdrop-blur'>
        <span
          className={`shrink-0 rounded-full ${spinnerSize} ${spinnerColors}`}
          style={{ animation: 'loadingSpin 0.8s linear infinite' }}
          aria-hidden='true'
        />
        <p className='text-sm font-medium tracking-wide text-slate-600'>{message}</p>
      </div>
    </div>
  )
}

export default Loading
