import { useState, useEffect } from "react"

function useTickFormatter() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return isMobile
    ? (value) => `₱${value >= 1000 ? (value / 1000) + 'k' : value}`
    : (value) => `₱ ${value.toLocaleString()}`
}

export default useTickFormatter