// import scopeCss from '../scope-css.mjs'
export default function CodeEditorTemplate({ html, state = {} }) {
  const formName = state?.attrs['form-name'] || ''
  const docName = state?.attrs['doc-name'] || ''
  const initialDoc = (state?.store?.repl && state.store.repl[docName]) || ''
  return html`
    <style>
      .min-height-editor {
        min-height: 16rem;
      }
      textarea.js-editor {
        tab-size: 2;
        background-color: white;
        color: black;
      }

      .js-editor {
        color: '#232b31';
        min-height: '100vh';
        background-color: 'white';
      }
      .cm-scroller {
        overflow: 'auto';
      }
      .cm-content {
        caret-color: 'red';
      }
      .editor.cm-focused .cm-cursor {
        border-left-color: '#0e9';
      }
      .js-editor.cm-focused .cm-selectionBackground,
      ::selection {
        background-color: '#074';
      }
      .cm-gutters {
        background-color: '#045';
        color: '#ddd';
        border: 'none';
      }
    </style>
    <link rel="stylesheet" href="/components/styles.css" />

    <div>
      <button type="button">capture</button>
      <div class="js-editor hidden font-mono text-p1 text0"></div>
      <noscript>
        <textarea
          class="  h-screen p0 w-full h-full font-mono text0  text-p2 leading1"
          name="${docName}"
          form="${formName}"
          placeholder="Enter HTML Source Code"
          spellcheck="false">
${initialDoc}</textarea
        >
      </noscript>
    </div>

    <script type="module">
      import codemirror from '/components/codemirror.bundle.mjs'

      class CodeEditor extends HTMLElement {
        constructor() {
          super()
          this.editorContainer = this.querySelector('div.js-editor')
          const doc = '\${initialDoc}' //TODO: This needs work. If you inject the doc here it escapes the template early.

          const {
            EditorState,
            basicSetup,
            EditorView,
            keymap,
            indentWithTab,
            javascript
          } = codemirror
          this.editor = new EditorView({
            state: EditorState.create({
              doc,
              extensions: [basicSetup, keymap.of([indentWithTab]), javascript()]
            }),
            parent: this.editorContainer
          })
        }

        get text() {
          return this.editor.state.doc.text.join('\\n')
        }

        connectedCallback() {
          this.editorContainer.style['display'] = 'block'
          console.log('editor is alive')
        }
      }
      customElements.define('code-editor', CodeEditor)
    </script>
  `
}
