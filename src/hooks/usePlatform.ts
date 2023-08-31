import { useEffect, useState } from 'react'

export const usePlatform = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const platform = isClient ? window.navigator.platform : ''

  const isApple =
    platform.toUpperCase().indexOf('MAC') >= 0 ||
    platform.toUpperCase().indexOf('IPAD') >= 0 ||
    platform.toUpperCase().indexOf('IPHONE') >= 0
  const isWindows = platform.toUpperCase().indexOf('WIN') >= 0
  const isLinux = platform.toUpperCase().indexOf('LINUX') >= 0

  return {
    isApple,
    isWindows,
    isLinux,
  }
}
