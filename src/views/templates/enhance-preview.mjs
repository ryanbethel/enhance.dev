export default function EnhancePreviewTemplate({ html, state = {} }) {
  const srcdoc = state?.store?.repl?.preview || ''
  return html`
    <div
      class="bg-g0 radius2 border-solid border-p0 border0 text-p2 p0 min-row-height-playground">
      <iframe srcdoc="${srcdoc}"></iframe>
    </div>

    <script type="module">
      class EnhancePreview extends HTMLElement {
        constructor() {
          super()

          this.iframe = this.querySelector('iframe')
        }
      }
      customElements.define('enhance-preview', EnhancePreview)
    </script>
  `
}
