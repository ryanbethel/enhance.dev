export default function EnhanceRenderTemplate({ html }) {
  return html`
    <div
      class="bg-g0 radius2 border-solid border-p0 border0 text-p2 p0 min-row-height-playground"></div>

    <script type="module">
      class EnhanceRendered extends HTMLElement {
        constructor() {
          super()
        }

        }
      }
      customElements.define('enhance-rendered', EnhanceRendered)
    </script>
  `
}
