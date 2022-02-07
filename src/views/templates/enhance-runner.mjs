export default function EnhanceRunnerTemplate({ html }) {
  return html`
    <style>
      enhance-runner .min-height-editor {
        min-height: 16rem;
      }
      enhance-runner textarea,
      enhance-runner pre,
      enhance-runner pre * {
        tab-size: 2;
      }

      enhance-runner textarea {
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

      enhance-runner code[class*='language-'],
      enhance-runner pre[class*='language-'] {
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

      enhance-runner pre[class*='language-']::-moz-selection,
      enhance-runner pre[class*='language-'] ::-moz-selection,
      enhance-runner code[class*='language-']::-moz-selection,
      enhance-runner code[class*='language-'] ::-moz-selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      enhance-runner pre[class*='language-']::selection,
      enhance-runner pre[class*='language-'] ::selection,
      enhance-runner code[class*='language-']::selection,
      enhance-runner code[class*='language-'] ::selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      @media print {
        enhance-runner code[class*='language-'],
        enhance-runner pre[class*='language-'] {
          text-shadow: none;
        }
      }

      /* Code blocks */
      /*code-editor pre[class*='language-'] {
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
      }*/

      enhance-runner :not(pre) > code[class*='language-'],
      enhance-runner pre[class*='language-'] {
        background: #f5f2f0;
      }

      /* Inline code */
      /*code-editor :not(pre) > code[class*='language-'] {
        padding: 0.1em;
        border-radius: 0.3em;
        white-space: normal;
      }*/

      enhance-runner .token.comment,
      enhance-runner .token.prolog,
      enhance-runner .token.doctype,
      enhance-runner .token.cdata {
        color: slategray;
      }

      enhance-runner .token.punctuation {
        color: #999;
      }

      enhance-runner .token.namespace {
        opacity: 0.7;
      }

      enhance-runner .token.property,
      enhance-runner .token.tag,
      enhance-runner .token.boolean,
      enhance-runner .token.number,
      enhance-runner .token.constant,
      enhance-runner .token.symbol,
      enhance-runner .token.deleted {
        color: #905;
      }

      enhance-runner .token.selector,
      enhance-runner .token.attr-name,
      enhance-runner .token.string,
      enhance-runner .token.char,
      enhance-runner .token.builtin,
      enhance-runner .token.inserted {
        color: #690;
      }

      enhance-runner .token.operator,
      enhance-runner .token.entity,
      enhance-runner .token.url,
      enhance-runner .language-css .token.string,
      enhance-runner .style .token.string {
        color: #9a6e3a;
        /* This background color was intended by the author of this theme. */
        background: hsla(0, 0%, 100%, 0.5);
      }

      enhance-runner .token.atrule,
      enhance-runner .token.attr-value,
      enhance-runner .token.keyword {
        color: #07a;
      }

      enhance-runner .token.function,
      enhance-runner .token.class-name {
        color: #dd4a68;
      }

      enhance-runner .token.regex,
      enhance-runner .token.important,
      enhance-runner .token.variable {
        color: #e90;
      }

      enhance-runner .token.important,
      enhance-runner .token.bold {
        font-weight: bold;
      }
      enhance-runner .token.italic {
        font-style: italic;
      }

      enhance-runner .token.entity {
        cursor: help;
      }
    </style>
    <link rel="stylesheet" href="/components/styles.css" />

    <div class="relative">
      <pre
        class="absolute min-height-editor p0 w-full h-full top0 left0 text-1 font-mono z0 radius2 border-solid border1 border-p0 overflow-auto whitespace-no-wrap text-p2 bg-g0 leading1 "
        aria-hidden="true">
        <code class="absolute p0 w-full h-full top0 left0 text-1 font-mono radius2 text-p2 bg-g0 language-html leading1 " >
        </code>
      </pre>
    </div>

    <script type="module">
      import enhance from '/components/enhance-source/enhance.mjs'
      import prettier from 'https://unpkg.com/prettier@2.5.1/esm/standalone.mjs'
      import parserBabel from 'https://unpkg.com/prettier@2.5.1/esm/parser-babel.mjs'
      import parserHtml from 'https://unpkg.com/prettier@2.5.1/esm/parser-html.mjs'

      class EnhanceRunner extends HTMLElement {
        constructor() {
          super()
          this.highlight = this.querySelector('pre')
          this.highlightContent = this.querySelector('code')
          this.update = this.update.bind(this)
          this.output = document.querySelector('.js-output> div')
          this.authoredTemplateElement = document.querySelector(
            '.js-authored-template textarea'
          )
          this.authoredTemplateElement.addEventListener('input', () => {
            this.update()
          })
          this.authoredMarkupElement = document.querySelector(
            '.js-authored-markup textarea'
          )
          this.authoredMarkupElement.addEventListener('input', () => {
            this.update()
          })
        }

        connectedCallback() {
          this.update()
        }

        update() {
          const template = this.authoredTemplateElement.value
          const rawMarkup = this.authoredMarkupElement.value
          function MyTag({ html }) {
            return html\` \${template}\`
          }
          const elements = { 'my-tag': MyTag }
          const html = enhance({ elements })
          const markup = html\`\${rawMarkup}\`
          console.log('markup:', markup)
          const strippedMarkup = markup
            .replace(new RegExp('<html><head></head><body>', 'g'), '')
            .replace(
              new RegExp(
                /<script>Array\\.from\\(document\\.getElementsByTagName\\("template"\\)\\)\\.forEach\\(t => t\\.content\\.lastElementChild && 'SCRIPT' === t\\.content\\.lastElementChild\\.nodeName\\?document\\.body\\.appendChild\\(t\\.content\\.lastElementChild\\)\\:''\\)<\\/script><\\/body><\\/html>/,
                'g'
              ),
              ''
            )
          console.log('stripped markup:', strippedMarkup)
          this.output.innerHTML = strippedMarkup

          const nice = prettier.format(markup, {
            parser: 'babel',
            plugins: [parserBabel, parserHtml]
          })
          console.log('nice:', nice)
          this.highlightContent.innerHTML = nice
            .replace(new RegExp('&', 'g'), '&amp;')
            .replace(new RegExp('<', 'g'), '&lt;')
          Prism.highlightElement(this.highlightContent)
        }
      }
      customElements.define('enhance-runner', EnhanceRunner)
    </script>
  `
}
