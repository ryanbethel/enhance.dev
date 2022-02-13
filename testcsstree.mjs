import * as csstree from 'css-tree'

// parse CSS to AST
const ast = csstree.parse('.example { world: "!" }')

console.log('ast:', ast.children.head.data.prelude.children)

// traverse AST and modify it
// csstree.walk(ast, (node) => {
//   if (node.type === 'ClassSelector' && node.name === 'example') {
//     node.name = 'hello'
//   }
// })

// generate CSS from AST
// console.log(csstree.generate(ast))
// .hello{world:"!"}
