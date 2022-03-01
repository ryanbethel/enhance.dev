import scopeCSS from '../scope-css.mjs'
export default function PlaygroundPage({ html, state }) {
  function scope(css) {
    scopeCSS({
      css,
      scopeTo: 'playground-page',
      disabled: !state?.store?.scopedCSS
    })
  }
  return html`
    <style>
      ${scope(`
      .min-row-height-playground {
        min-height: 18rem;
      }
      `)}
    </style>
    <link rel="stylesheet" href="/components/styles.css" />
    <div class="bg-p2 text-p1">
      <nav-bar></nav-bar>
      <div class="m-auto ">
        <noscript>
          <button form="run-repl" type="submit">Run REPL</button>
        </noscript>
        <div
          class="grid gap0 col-1  col-2-lg flow-row text1 m1 m-none-lg justify-between">
          <tab-container quantity="3" class=" w-full h-screen ">
            <span slot="title1">index</span>
            <code-editor
              slot="content1"
              form-name="run-repl"
              doc-name="entrySrc">
            </code-editor>
            <span slot="title2">template-1</span>
            <code-editor
              slot="content2"
              form-name="run-repl"
              doc-name="component1Src"></code-editor>
            <span slot="title3">template-2</span>
            <code-editor
              slot="content3"
              form-name="run-repl"
              doc-name="component2Src">
            </code-editor>
          </tab-container>
          <tab-container quantity="2" class=" w-full h-screen ">
            <span slot="title1">Preview</span>
            <enhance-preview slot="content1" doc-src="previewDoc">
            </enhance-preview>
            <span slot="title2">HTML</span>
            <markup-preview
              slot="content2"
              doc-name="enhancedMarkup"></markup-preview>
          </tab-container>
        </div>
      </div>
      <noscript>
        <button form="run-repl" type="submit">Run REPL</button>
        <form id="run-repl" action="/repl" method="POST"></form>
      </noscript>
    </div>
  `
}
