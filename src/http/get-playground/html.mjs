import enhance from '@enhance/ssr'
import layout from '@architect/views/page-layout.mjs'
const { document } = layout
import data from '@begin/data'
import elements from '@architect/views/elements.mjs'
let html = enhance()

const entryBoilerplate = `
//import enhance from '@enhance/ssr'
//import elements from '@architect/views/elements.mjs'

export default async function handler() {
 // const html = enhance({
 //   elements,
 //   initialState: {}
 // })

    return {
      document: html\`<div>Hello World</div>\`
    }
}
`

const templateBoilerplate = `
export default function({ html,state={} }) {
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
export default async function HTML(req) {
  const key = req?.query?.key
  try {
    let repl = {
      enhancedMarkup: '',
      previewDoc: '',
      entrySrc: entryBoilerplate,
      component1Src: templateBoilerplate,
      component2Src: ''
    }
    if (key) {
      const result = await poll(
        async () => data.get({ table: 'repl', key }),
        2000,
        100
      ).catch((e) => console.log(e))
      repl = result?.repl ? result.repl : repl
    }
    html = enhance({
      elements,
      initialState: {
        scopedCSS: true,
        repl,
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

async function poll(fn, timeout, interval) {
  const endTime = Number(new Date()) + (timeout || 2000)
  interval = interval || 100

  async function checkCondition(resolve, reject) {
    // If the condition is met, we're done!
    const result = await fn()
    if (result) {
      resolve(result)
    }
    // If the condition isn't met but the timeout hasn't elapsed, go again
    else if (Number(new Date()) < endTime) {
      setTimeout(checkCondition, interval, resolve, reject)
    }
    // Didn't match and too much time, reject!
    else {
      reject(new Error('timed out for ' + fn + ': ' + arguments))
    }
  }

  return new Promise(checkCondition)
}
