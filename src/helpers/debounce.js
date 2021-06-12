export function debounce(fn, time) {
    let timeout = null;

    return function() {
        const next = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(next, time);
    };
}

export function throttle(callback, wait, immediate = false) {
  let timeout = null
  let initialCall = true

  return function() {
    const callNow = immediate && initialCall
    const next = () => {
      callback.apply(this, arguments)
      timeout = null
    }

    if (callNow) {
      initialCall = false
      next()
    }

    if (!timeout) {
      timeout = setTimeout(next, wait)
    }
  }
}