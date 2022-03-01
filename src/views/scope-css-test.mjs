import buildScoper from './scope-css.mjs'
import test from 'tape'

test('test a block', (t) => {
  t.plan(1)
  const scope = buildScoper({
    scopeTo: 'my-tag',
    disable: false,
    instance: 'abc'
  })

  const styleString = `
  //global block
  <style enh-scope="global"> 
    div {
       background:blue;
     }
  </style>

  <style> 
    div {
       background:blue;
     }
  </style>

// component block
  <style enh-scope="component">
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
  </style>

// instance block
  <style enh-scope="instance">
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
  </style>`

  console.log(scope`${styleString}`)

  t.pass('')
})
