'use client'

import React from 'react';

const useMediaQuery = () => {
  const isClient = typeof window === 'object'

  const [width, setWidth] = React.useState<number>(isClient ? window.innerWidth : 0)

  React.useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])

  return width
}

export default useMediaQuery
 