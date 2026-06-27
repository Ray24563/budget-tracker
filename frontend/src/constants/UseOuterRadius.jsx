import { useState, useEffect } from 'react'

function useOuterRadius() {
  const [radius, setRadius] = useState(90)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1280) setRadius(90)       // xl+
      else setRadius(80)                  // mobile
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return radius
}

export default useOuterRadius