import * as cssParser from 'css'

export default function scopeCss({
  css = '',
  scopeTo = '',
  disabled = false,
  instance = ''
}) {
  if (disabled || !scopeTo) return css
  const parsed = cssParser.parse(css)

  function scopeIt(arr) {
    arr.forEach((v, i, a) => {
      if (v.type === 'rule') {
        a[i].selectors = a[i].selectors.map((s) =>
          `${scopeTo}${instance ? `.${instance}` : ''} ${s}`
            .replace(/(::slotted)\(\s*(.+)\s*\)/, '$2')
            .replace(
              /([[a-zA-Z0-9_-]*)(::part)\(\s*(.+)\s*\)/,
              '[part*="$3"][part*="$1"]'
            )
            // the component is added above so host is just removed here
            .replace(':host', '')
        )
      }
      if (v.type === 'media') {
        scopeIt(a[i].rules)
      }
    })
  }
  scopeIt(parsed.stylesheet?.rules)
  return cssParser.stringify(parsed)
}
