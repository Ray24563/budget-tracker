import { useState, useEffect } from "react"

function useTickSize() {
  const [size, setSize] = useState(15)

  useEffect(() => {
    const update = () => {
      setSize(window.innerWidth >= 768 ? 15 : 11)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

export default useTickSize