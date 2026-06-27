import { useState, useEffect } from "react"

function useBarSize() {
  const [barSize, setBarSize] = useState(40)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1280) setBarSize(40)      // xl
      else if (w >= 1024) setBarSize(32) // lg
      else if (w >= 768) setBarSize(24)  // md
      else setBarSize(18)                 // mobile
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return barSize
}

export default useBarSize