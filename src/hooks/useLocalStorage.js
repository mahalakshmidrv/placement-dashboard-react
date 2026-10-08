import { useEffect, useState } from 'react'

/** useState that persists to localStorage. `initial` may be a value or a function. */
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw)
    } catch {
      /* ignore corrupted storage */
    }
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage may be full or blocked */
    }
  }, [key, value])

  return [value, setValue]
}
