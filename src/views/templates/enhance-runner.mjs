export default function EnhanceRunnerTemplate({ html }) {
  return html`
    <script type="module">
      import API from '/components/data/api.mjs'
      import enhance from '/components/enhance-source/enhance.mjs'
      import prettier from 'https://unpkg.com/prettier@2.5.1/esm/standalone.mjs'
      import parserBabel from 'https://unpkg.com/prettier@2.5.1/esm/parser-babel.mjs'
      import parserHtml from 'https://unpkg.com/prettier@2.5.1/esm/parser-html.mjs'

      class EnhanceRunner extends HTMLElement {
        constructor() {
          super()
          this.api = API()
          this.update = this.update.bind(this)
          this.allEditors = document.querySelectorAll('code-editor')
          this.editorNames = []
          this.allDocs = this.allEditors.forEach(
            (editor, i) => (this.editorNames[i] = editor.docName)
          )
          this.api.repl.create({ name: 'enhanceMarkup', doc: '' })
          this.api.repl.create({ name: 'iframeSrc', doc: '' })
        }

        connectedCallback() {
          this.api.subscribe(this.update, this.allDocs)
        }
        disconnectedCallback() {
          this.api.unsubscribe(this.update)
        }

        async update(docs) {
          const { entrySrc = '', component1Src = '', component2Src = '' } = docs

          const userDoc = await process({
            entrySrc,
            component1Src,
            component2Src
          })
          this.api.repl.update({
            name: 'enhancedMarkup',
            doc: userDoc.enhancedMarkup
          })
          this.api.repl.update({
            name: 'iframeSrc',
            doc: userDoc.iframeSrc
          })

          async function process(repl) {
            const entryFunction = funkifyEntry(repl.entrySrc)
            const component1Function = funkifyComponent(repl.component1Src)
            const tagName1 = getTagName(repl.component1Src)
            const component2Function = funkifyComponent(repl.component2Src)
            const tagName2 = getTagName(repl.component2Src)
            const elements = {}
            elements[tagName1] = component1Function()
            elements[tagName2] = component2Function()
            const html = enhance({ elements })
            const handler = await entryFunction({ html, elements, enhance })
            const previewDoc = await handler()
            const prettyMarkup = prettier.format(previewDoc.document, {
              parser: 'babel',
              plugins: [parserBabel, parserHtml]
            })
            //.replace(new RegExp('&', 'g'), '&amp;')
            //.replace(new RegExp('<', 'g'), '&lt;')
            const enhancedMarkup = Prism.highlight(
              prettyMarkup,
              Prism.languages.markup,
              'markup'
            )
            return {
              enhancedMarkup: enhancedMarkup,
              iframeSrc: previewDoc.document
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
            }
          }

          function funkifyEntry(str) {
            const AsyncFunction = Object.getPrototypeOf(
              async function () {}
            ).constructor
            const patternImport = new RegExp(
              /import(?:["'\\s]*([\\w*\${}\\n\\r\\t, ]+)from\\s*)?["'\\s]["'\\s](.*[@\\w_-]+)["'\\s].*;?$/,
              'mg'
            )
            const funcString = str
              ?.replace(/export default/, 'return ')
              ?.replace(/^\\s*import\\s*enhance\\s*from.*$/gm, '')
              ?.replace(patternImport, "const $1= (await import('$2')).default")
            const funcStringWithScope =
              ' const {enhance={},html={},elements={}}= args; return (async function(){ ' +
              funcString +
              ' })()'
            const newFunc = new AsyncFunction('args', funcStringWithScope)
            return newFunc
          }

          function funkifyComponent(str) {
            const funcString = str?.replace(/export default/, 'return ')
            const newFunc = new Function(funcString)
            return newFunc
          }
          function getTagName(text) {
            return text?.replace(
              new RegExp(
                /^(.|\\n|\\r)*^\\s*customElements.define\\(['"]([a-zA-Z\\-0-9]*)['"](.|\\n|\\r)*$/,
                'mg'
              ),
              '$2'
            )
          }
        }
      }
      customElements.define('enhance-runner', EnhanceRunner)
    </script>
  `
}
