const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

async function main() {
  const entryBoilerplate = `
import enhance from '@enhance/ssr'
//import elements from './src/views/elements.mjs'


export default async function handler() {
 const html = enhance({
      elements,
     // initialState: {}
    })
console.log({elements})
    return {
      document: html\`<div>Hello World</div><my-tag></my-tag>\`
    }
}
`

  const componentBoilerplate = `
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

  const entryBoilerplateWithStuff = `
function (){

const html ={}
const enhance ={}
const elements ={}

import enhance from '@enhance/ssr'
import elements from '.src/views/elements.mjs'

return async function handler() {
 const html = enhance({
     // elements,
     // initialState: {}
    })

    return {
      document: html\`<div>Hello World</div>\`
    }
}

}()
`

  function funkifyEntry(str) {
    const funcString = str
      ?.replace(/export default/, 'return ')
      ?.replace(
        new RegExp(
          /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;?$/,
          'mg'
        ),
        "const $1= (await import('$2')).default"
      )
    console.log({ str, funcString })
    const funcStringWithScope = `
  const {enhance={},html={},elements={}}= args
  return (async function(){ ${funcString} })()
  `
    console.log({ str, funcString, funcStringWithScope })
    const newFunc = new AsyncFunction('args', funcStringWithScope)
    return newFunc
  }

  function funkifyComponent(str) {
    const funcString = str?.replace(/export default/, 'return ')
    console.log({ str, funcString })
    const newFunc = new Function(funcString)
    return newFunc
  }

  function getTagName(text) {
    return text?.replace(
      new RegExp(
        /^(.|\n|\r)*^\s*customElements.define\(['"]([a-zA-Z\-0-9]*)['"](.|\n|\r)*$/,
        'mg'
      ),
      '$2'
    )
  }

  // const { elements = {}, enhance = {}, html = {} } = {}
  //   const handler = await funkifyEntry(entryBoilerplate)({
  //     enhance,
  //     html,
  //     elements
  //   })
  //   console.log(await handler())
  const entryFunction = funkifyEntry(entryBoilerplate)
  const component1Function = funkifyComponent(componentBoilerplate)
  const tagName1 = getTagName(componentBoilerplate)
  console.log(component1Function)
  const elements = {}
  elements[tagName1] = component1Function()
  console.log({ elements })
  console.log(elements)
  // const html = enhance({ elements })
  // console.log({ html })
  const { enhance = {}, html = {} } = {}
  const handler = await entryFunction({ html, elements, enhance })
  console.log({ handler })
  const previewDoc = await handler()
  console.log({ previewDoc })
}

main()
