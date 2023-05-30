export const usePlatform = () => {
  const platform = window.navigator.platform

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
