import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// Keep native typing synchronous while URL updates render in a transition.
// History navigation and resets still restore the URL's saved search value.
export function useSearchInput(query: string) {
  const input = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigationType = useNavigationType()
  useLayoutEffect(() => {
    if (
      input.current &&
      (navigationType !== 'REPLACE' || document.activeElement !== input.current)
    ) {
      input.current.value = query
    }
  }, [query, location.key, navigationType])
  return input
}
