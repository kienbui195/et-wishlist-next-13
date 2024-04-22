import { useCallback, useEffect, useState } from 'react'

const useUpdateView = () => {
  const [isScrollToBottom, setIsScrollToBottom] = useState(false)

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } =
      document.documentElement || document.body
    const scrollPosition = (scrollTop + clientHeight) / scrollHeight
    if (scrollPosition >= 2 / 3) {
      setIsScrollToBottom(true)
    } else {
      setIsScrollToBottom(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { isScrollToBottom }
}

export default useUpdateView
