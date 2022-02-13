import enhance from '@enhance/ssr'
import layout from '@architect/views/page-layout.mjs'
const { document } = layout
import data from '@begin/data'
import elements from '@architect/views/elements.mjs'
let html = enhance()

const patternImport = new RegExp(
  /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;?$/,
  'mg'
)
const patternDImport = new RegExp(
  /import\((?:["'\s]*([\w*{}\n\r\t, ]+)\s*)?["'\s](.*([@\w_-]+))["'\s].*\);?$/,
  'mg'
)

const entryBoilerplate = `
import enhance from '@enhance/ssr'
import elements from '@architect/views/elements.mjs'

export default async function handler() {
 const html = enhance({
     // elements,
     // initialState: {}
    })

    return {
      document: html\`<div>Hello World</div>\`
    }
}
`
const entry1 = entryBoilerplate
  .replace(/export default/, 'return ')
  .replace(patternImport, "const $1= (await import('$2')).default")
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

// if args needed they go before function string new AsyncFunction("arg1",funcString)
const entryFunc = new AsyncFunction(entry1)

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

export default async function HTML() {
  console.log({ entry1 })
  console.log(await (await entryFunc())())
  try {
    let result = await data.get({ table: 'repl', key: 'user1' })
    // console.log(result)
    html = enhance({
      elements,
      initialState: {
        scopedCSS: true,
        repl: result?.repl || {},
        context: {},
        loggedIn: false,
        location: '/',
        menuLinks: [
          { name: 'Docs', location: '/docs' },
          { name: 'Tutorial', location: '/tutorial' },
          { name: 'Playground', location: '/playground' }
        ]
      }
    })

    return {
      statusCode: 200,
      html: html` ${document({
        body: `<playground-page></playground-page>`,
        scripts: `
        <script src="/components/enhance-source/parse5.browserify.min.js"></script>
        <script src="/components/prism.js"></script> `
      })}`
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      html: html`<error-page error=${err}></error-page>`
    }
  }
}
