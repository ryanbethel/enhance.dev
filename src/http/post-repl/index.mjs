import arc from '@architect/functions'
import data from '@begin/data'
import prettier from 'prettier'
import Prism from 'prismjs'
import enhance from '@enhance/ssr'

// if args needed they go before function string new AsyncFunction("arg1",funcString)
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

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

async function repl(req) {
  const body = req.body
  console.log({ body })
  const entryFunction = funkifyEntry(body.entrySrc)
  const component1Function = funkifyComponent(body.component1Src)
  const tagName1 = getTagName(body.component1Src)
  const component2Function = funkifyComponent(body.component2Src)
  const tagName2 = getTagName(body.component2Src)
  const elements = {}
  elements[tagName1] = component1Function()
  elements[tagName2] = component2Function()
  console.log({ elements })
  const html = enhance({ elements })
  console.log({ html })
  const handler = await entryFunction({ html, elements, enhance })
  console.log({ handler })
  const previewDoc = await handler()

  console.log({ previewDoc })
  const prettyMarkup = prettier.format(previewDoc.document, {
    parser: 'html'
  })
  // .replace(new RegExp('&', 'g'), '&amp;')
  // .replace(new RegExp('<', 'g'), '&lt;')
  console.log({ prettyMarkup })
  const enhancedMarkup = Prism.highlight(
    prettyMarkup,
    Prism.languages.markup,
    'markup'
  )

  console.log({ enhancedMarkup })

  await data.set({
    key: 'user1',
    table: 'repl',
    repl: {
      enhancedMarkup,
      previewDoc: previewDoc.document
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;'),
      entrySrc: body.entrySrc,
      component1Src: body.component1Src,
      component2Src: body.component2Src
    }
  })

  // const template = this.authoredTemplateElement.value
  // const rawMarkup = this.authoredMarkupElement.value
  // function MyTag({ html }) {
  //   return html` ${template}`
  // }
  // //const elements = { 'my-tag': MyTag }
  // const html = enhance({ elements })
  // const markup = html`${rawMarkup}`
  // console.log('markup:', markup)
  // const strippedMarkup = markup
  // console.log('stripped markup:', strippedMarkup)
  // this.output.innerHTML = strippedMarkup

  // const nice = prettier.format(markup, {
  //   parser: 'babel',
  //   plugins: [parserBabel, parserHtml]
  // })
  // console.log('nice:', nice)
  // this.highlightContent.innerHTML = nice
  //   .replace(new RegExp('&', 'g'), '&amp;')
  //   .replace(new RegExp('<', 'g'), '&lt;')
  // Prism.highlightElement(this.highlightContent)

  // let preview = html`<div>Hello World</div>`
  // console.log({ preview })
  // preview = preview.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  // console.log({ preview })
  //  await data.set({
  //     table: 'repl',
  //     key: 'user1',
  //     repl: { index: body?.index || '', preview }
  //   })
  return {
    status: 303,
    location: '/playground'
  }
}

export const handler = arc.http.async(repl)
