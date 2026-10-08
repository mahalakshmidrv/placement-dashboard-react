export default function Logo({ light = false }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`}>
      <svg viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#F2B544" />
        <path d="M16 44V20h14a8 8 0 010 16H22" fill="none" stroke="#16324F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="44" r="4" fill="#16324F" />
      </svg>
      <span>PlaceTrack</span>
    </div>
  )
}
