import scopeCSS from './src/views/scope-css.mjs'
console.log(
  scopeCSS({
    css: `
    :host {
      display: block;
    }
    .container > ::slotted(*) {
      display: block;
    }
    .container > ::slotted(*[slot="title"]) {
      display: block;
    }
    .foo {
      display: block;
    }

    something-else::part(tab) {
      display:block
    }
`,
    scopeTo: 'my-tag',
    instance: ''
  })
)
