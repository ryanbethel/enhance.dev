```html
<!-- Authored -->
<my-element>
  <!-- shadow-root -->
  <style scope="global"> /*or <style> with no scope attribute*/
    div {background:blue;}
  </style>

  <style scope="component">
    :host {
      display: block;
    }
    .container > slot::slotted(*) {
      display: block;
    }
    .container > slot[name="title"]::slotted(*) {
      display: block;
    }
    .foo {
      display: block;
    }
  </style>

  <style scope="instance">
    :host {
      display: block;
    }
    .container > slot::slotted(*) {
      display: block;
    }
    .container > slot[name="title"]::slotted(*) {
      display: block;
    }
    .foo {
      display: block;
    }
  </style>
  <div class="foo">Shadow</div>
  <div class="container">
    <slot> </slot>
    <slot name="title"></slot>
  </div>
  <!-- /shadow-root -->
  <span>Light</span>
  <span slot="title">Title</span>
</my-element>
```



```html
<!-- Becomes -->
<style scope="global">
    div {
      background:blue;
      }
</style>
<style scope="my-element">
  my-element {
    display: block;
  }
  my-element .container > * {
      display: block;
  }
  my-element .container > *[slot="title"] {
      display: block;
  }
  my-element .foo {
      display: block;
  }
</style>
<style scope="my-element.xyz123">
  my-element.xyz123 {
    display: block;
  }
  my-element.xyz123 .container > * {
      display: block;
  }
  my-element.xyz123 .container > *[slot="title"] {
      display: block;
  }
  my-element.xyz123 .foo {
      display: block;
  }
</style>
<my-element class="xyz123">
  <div class="foo">Shadow</div>
  <div class="container">
    <span>Light</span>
    <span slot="title">Title</span>
  </div>
</my-element>
```