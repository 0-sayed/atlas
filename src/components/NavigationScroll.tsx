import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// HashRouter leaves document scrolling to the app. Retain history positions,
// and allow an explicit return link to restore its originating destination.
export function NavigationScroll() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const historyPositions = useRef(new Map<string, number>())
  const destinationPositions = useRef(new Map<string, number>())
  const previousPath = useRef(location.pathname)

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    const destination = location.pathname + location.search
    const target =
      navigationType === 'POP'
        ? (historyPositions.current.get(location.key) ?? 0)
        : location.state?.restorePosition === true
          ? (destinationPositions.current.get(destination) ?? 0)
          : previousPath.current !== location.pathname
            ? 0
            : window.scrollY
    window.scrollTo(0, target)
    previousPath.current = location.pathname
    const remember = () => {
      historyPositions.current.set(location.key, window.scrollY)
      destinationPositions.current.set(destination, window.scrollY)
    }
    remember()
    window.addEventListener('scroll', remember, { passive: true })
    // Capture the final position before a link or keyboard activation navigates.
    document.addEventListener('click', remember, true)
    return () => {
      window.removeEventListener('scroll', remember)
      document.removeEventListener('click', remember, true)
    }
  }, [
    location.key,
    location.pathname,
    location.search,
    location.state,
    navigationType,
  ])
  return null
}
