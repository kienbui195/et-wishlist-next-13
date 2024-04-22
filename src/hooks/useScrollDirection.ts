import * as React from 'react'

const useScrollDirection = () => {
  const [isScrollTop, setIsScrollTop] = React.useState(true)
  const [isScrollingDown, setIsScrollingDown] = React.useState(false)

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (scrollY > lastScrollY) {
            setIsScrollingDown(true)
          } else {
            setIsScrollingDown(false)
          }
          setIsScrollTop(scrollY === 0)
          lastScrollY = scrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', updateScrollDirection)

    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [])

  return {isScrollingDown, isScrollTop}
}

export default useScrollDirection
