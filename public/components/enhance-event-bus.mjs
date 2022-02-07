export default function EventBus(element) {
  let _bus = element
  const _subscribe = (event, callback) => {
    _bus.addEventListener(event, callback)
  }
  const _unsubscribe = (event, callback) => {
    _bus.removeEventListener(event, callback)
  }
  const _fire = (event, detail = {}) => {
    // eslint-disable-next-line no-undef
    _bus.dispatchEvent(new CustomEvent(event, { detail }))
  }
  return {
    subscribe: _subscribe,
    unsubscribe: _unsubscribe,
    fire: _fire,
  }
}
