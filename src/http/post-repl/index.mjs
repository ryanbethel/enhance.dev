import arc from '@architect/functions'
import data from '@begin/data'
import prettier from 'prettier'
import prism from 'prism'
import enhance from '@enhance/ssr'
const html = enhance({})

const entryBoilerplate = `
import enhance from '@enhance/ssr'
import elements from '@architect/views/elements.mjs'

export default async function HTML() {
 const html = enhance({
      elements,
      initialState: {}
    })

    return {
      body: html\`<my-tag></my-tag>\`
    }
  } 
}
`

const templateBoilerplate = `
export default function MyTagTemplate({ html,state={} }) {
  const {store={},attr={}}=state
  return html\`
    <style>
        div {
        color:gray;
      }
    </style>
    <div>
      <slot></slot>
    </div>

    <script type="module">
      class MyTag extends HTMLElement {
        constructor() {
          super()
        }
      }
      customElements.define('my-tag', MyTag)
    </script>
  \`
}
`

async function repl(req) {
  const body = req.body

  const template = this.authoredTemplateElement.value
  const rawMarkup = this.authoredMarkupElement.value
  function MyTag({ html }) {
    return html` ${template}`
  }
  const elements = { 'my-tag': MyTag }
  const html = enhance({ elements })
  const markup = html`${rawMarkup}`
  console.log('markup:', markup)
  const strippedMarkup = markup
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

  let preview = html`<div>Hello World</div>`
  console.log({ preview })
  preview = preview.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  console.log({ preview })
  await data.set({
    table: 'repl',
    key: 'user1',
    repl: { index: body?.index || '', preview }
  })
  return {
    status: 303,
    location: '/playground'
  }
}

export const handler = arc.http.async(repl)
