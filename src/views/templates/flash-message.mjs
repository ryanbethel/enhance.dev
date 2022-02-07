export default function FlashMessageTemplate(html, state = {}) {
  const { flash = [], handleContexts = [] } = state.store

  const handleNow = flash.filter((m) => handleContexts.includes(m.context))
  return html`
    <style>
      .flash-content {
        width: 600px;
        margin: 20px auto;
      }
      .flash-dialog {
        display: none;
        border: solid;
        border-width: 1px;
      }
      .flash-dialog:target {
        display: block;
      }
      .warning {
        background-color: yellow;
      }
      .success {
        background-color: lightgreen;
      }
      .failure {
        background-color: lightpink;
      }
    </style>

    ${flash.length > 0 &&
    `
    <a href="#flash-dialog"  class="flash-show">Show Flash</a>
    <div class="flash-dialog" id="flash-dialog">
      <div class="flash-content">
        <a href="#" class="flash-close">&times;</a>
        <div class="flash-message">
          ${handleNow
            .map(
              (m) =>
                '<div class="' +
                (m.type || '') +
                '">' +
                m.message +
                '</div> <p>' +
                JSON.stringify(m) +
                '</p> '
            )
            .join('')}
          <slot name="flash-slot"></slot>
        </div>
      </div>
    </div>
    `}
    <script type="module">
      import API from '/components/data/api.js'

      class FlashMessage extends HTMLElement {
        constructor() {
          super()
          this.api = API()
          this.update = this.update.bind(this)
          this.newFlashMessages.bind(this)
          this.showFlash = this.querySelector('.flash-show')
          this.closeFlash = this.querySelector('.flash-close')
          this.flashMessage = this.querySelector('.flash-message')
        }

        connectedCallback() {
          this.api.subscribe(this.update, ['flash'])
        }
        disconnectedCallback() {
          this.api.unsubscribe(this.update)
        }
        update({ flash }) {
          if (flash) {
            const flashHere = flash.find((i) =>
              Array.from([
                ${handleContexts.map((j) => '"' + j + '",').join(' ')}
              ]).includes(i.context)
            )
          }
        }

        newFlashMessages(messages) {
          this.flashMessage.innerHTML = messages
            .map(
              (m) => \`
                 \${\`<div class="\${m.type || ''}"> \${
                   m.message
                 }</div> <p>\${JSON.stringify(m)}</p> \`}\`
            )
            .join('')
        }
      }

      customElements.define('flash-message', FlashMessage)
    </script>
  `
}
