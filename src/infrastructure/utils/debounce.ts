export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this

    const later = function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}
