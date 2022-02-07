export default function PlaygroundPage({ html }) {
  return html`
    <style>
      .min-row-height-playground {
        min-height: 18rem;
      }
    </style>
    <link rel="stylesheet" href="/components/styles.css" />
    <div class="bg-p2 text-p1">
      <nav-bar></nav-bar>
      <div class="text-center m-auto font-sans text2 p1">
        <h1>Playground</h1>
      </div>
      <div class="m-auto ">
        <div
          class="grid col-2 pl0 pr0 gap-1 col-3-lg flow-row text1 m1 m-none-lg justify-between">
          <div class="min-row-height-playground w-full  flex flex-col">
            <h4 class="p-none pl0 font-sans">Authored Template(my-tag)</h4>
            <code-editor class="js-authored-template"> </code-editor>
          </div>
          <div class="min-row-height-playground w-full  flex flex-col">
            <h4 class="p-none pl0 font-sans">Authored Markup</h4>
            <code-editor class="js-authored-markup"> </code-editor>
          </div>
          <div class="min-row-height-playground w-full  flex flex-col">
            <h4 class="p-none pl0 font-sans">SSR Markup Output</h4>
            <enhance-runner> </enhance-runner>
          </div>
          <div
            class="min-row-height-playground w-full col-span-3 flex flex-col">
            <h4 class="p-none pl0 font-sans">Output</h4>
            <enhance-rendered class="js-output"> </enhance-rendered>
          </div>
        </div>
      </div>
    </div>
  `
}
