export default function CodeEditorTemplate({ html }) {
  return html`
    <style>
      code-editor .min-height-editor {
        min-height: 16rem;
      }
      code-editor textarea,
      code-editor pre,
      code-editor pre * {
        tab-size: 2;
      }

      code-editor textarea {
        background-color: transparent;
        caret-color: var(--p0);
        resize: none;
      }

      /* PrismJS 1.26.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript */
      /**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

      code-editor code[class*='language-'],
      code-editor pre[class*='language-'] {
        color: black;
        background: none;
        text-shadow: 0 1px white;
        white-space: pre;
        /*font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;*/
      }

      code-editor pre[class*='language-']::-moz-selection,
      code-editor pre[class*='language-'] ::-moz-selection,
      code-editor code[class*='language-']::-moz-selection,
      code-editor code[class*='language-'] ::-moz-selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      code-editor pre[class*='language-']::selection,
      code-editor pre[class*='language-'] ::selection,
      code-editor code[class*='language-']::selection,
      code-editor code[class*='language-'] ::selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      @media print {
        code-editor code[class*='language-'],
        code-editor pre[class*='language-'] {
          text-shadow: none;
        }
      }

      /* Code blocks */
      /*code-editor pre[class*='language-'] {
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
      }*/

      code-editor :not(pre) > code[class*='language-'],
      code-editor pre[class*='language-'] {
        background: #f5f2f0;
      }

      /* Inline code */
      /*code-editor :not(pre) > code[class*='language-'] {
        padding: 0.1em;
        border-radius: 0.3em;
        white-space: normal;
      }*/

      code-editor .token.comment,
      code-editor .token.prolog,
      code-editor .token.doctype,
      code-editor .token.cdata {
        color: slategray;
      }

      code-editor .token.punctuation {
        color: #999;
      }

      code-editor .token.namespace {
        opacity: 0.7;
      }

      code-editor .token.property,
      code-editor .token.tag,
      code-editor .token.boolean,
      code-editor .token.number,
      code-editor .token.constant,
      code-editor .token.symbol,
      code-editor .token.deleted {
        color: #905;
      }

      code-editor .token.selector,
      code-editor .token.attr-name,
      code-editor .token.string,
      code-editor .token.char,
      code-editor .token.builtin,
      code-editor .token.inserted {
        color: #690;
      }

      code-editor .token.operator,
      code-editor .token.entity,
      code-editor .token.url,
      code-editor .language-css .token.string,
      code-editor .style .token.string {
        color: #9a6e3a;
        /* This background color was intended by the author of this theme. */
        background: hsla(0, 0%, 100%, 0.5);
      }

      code-editor .token.atrule,
      code-editor .token.attr-value,
      code-editor .token.keyword {
        color: #07a;
      }

      code-editor .token.function,
      code-editor .token.class-name {
        color: #dd4a68;
      }

      code-editor .token.regex,
      code-editor .token.important,
      code-editor .token.variable {
        color: #e90;
      }

      code-editor .token.important,
      code-editor .token.bold {
        font-weight: bold;
      }
      code-editor .token.italic {
        font-style: italic;
      }

      code-editor .token.entity {
        cursor: help;
      }
    </style>
    <link rel="stylesheet" href="/components/styles.css" />

    <div class="relative">
      <textarea
        class=" absolute min-height-editor p0 w-full h-full top0 left0 z1 radius2 font-mono text-1 border-solid border1 border-p0 text-transparent leading1"
        placeholder="Enter HTML Source Code"
        spellcheck="false"></textarea>
      <pre
        class="absolute min-height-editor p0 w-full h-full top0 left0 text-1 font-mono z0 radius2 border-solid border1 border-p0 overflow-auto whitespace-no-wrap text-p2 bg-g0 leading1 "
        aria-hidden="true">
        <code class="absolute p0 w-full h-full top0 left0 text-1 font-mono radius2 text-p2 bg-g0 language-html leading1 " >
        </code>
      </pre>
    </div>

    <script type="module">
      class CodeEditor extends HTMLElement {
        constructor() {
          super()
          this.editor = this.querySelector('textarea')
          this.highlight = this.querySelector('pre')
          this.highlightContent = this.querySelector('code')
          this.update = this.update.bind(this)
          this.syncScroll = this.syncScroll.bind(this)
          this.checkTab = this.checkTab.bind(this)
          this.editor.addEventListener('input', () => {
            this.update(this.editor.value)
            this.syncScroll(this.editor)
          })
          this.editor.addEventListener('scroll', () =>
            this.syncScroll(this.editor)
          )
          this.editor.addEventListener('keydown', (e) =>
            this.checkTab(this.editor, e)
          )
        }

        connectedCallback() {
          this.update(this.editor.value)
        }

        update(text) {
          // Handle final newlines
          if (text[text.length - 1] == '\\n') {
            text += ' '
          }
          this.highlightContent.innerHTML = text
            .replace(new RegExp('&', 'g'), '&amp;')
            .replace(new RegExp('<', 'g'), '&lt;')
          Prism.highlightElement(this.highlightContent)
        }

        syncScroll(element) {
          this.highlight.scrollTop = element.scrollTop
          this.highlight.scrollLeft = element.scrollLeft
        }

        checkTab(element, event) {
          let code = element.value
          if (event.key == 'Tab') {
            event.preventDefault()
            let beforeTab = code.slice(0, element.selectionStart)
            let afterTab = code.slice(
              element.selectionEnd,
              element.value.length
            )
            let cursorPos = element.selectionEnd + 1
            element.value = beforeTab + '	' + afterTab
            element.selectionStart = cursorPos
            element.selectionEnd = cursorPos
            this.update(element.value)
          }
        }
      }
      customElements.define('code-editor', CodeEditor)
    </script>
  `
}
