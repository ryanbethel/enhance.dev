export function initProvider(container) {
  container._providers = new Map()

  container.addEventListener('request-provider', (event) => {
    let key = event.detail.key
    if (container._providers.has(key)) {
      event.detail.provider = container._providers.get(key)
      event.preventDefault()
      event.stopPropagation()
    }
  })
}

export function provide(key, dependency, container) {
  container._providers.set(key, dependency)
}

export function requestProvider(key) {
  let event = new CustomEvent('request-provider', {
    detail: { key },
    bubbles: true,
    cancelable: true,
  })
  this.dispatchEvent(event)
  if (event.defaultPrevented) {
    return event.detail.provider
  } else {
    throw new Error(`no provider found for ${key}`)
  }
}
