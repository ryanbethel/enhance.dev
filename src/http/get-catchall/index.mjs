import arc from '@architect/functions'
import treeDb from '@architect/shared/tree-db.mjs'
import enhance from '@enhance/ssr'
import elements from '@architect/views/elements.mjs'
const html = enhance({ elements })
import redirect from '@architect/views/redirect.mjs'
import four0four from '@architect/views/four-0-four.mjs'

export const handler = arc.http.async(goThere)

async function goThere(req) {
  const rawPath = req.rawPath
  const pathParts = rawPath.split('/')
  const username = pathParts[1]
  const path = '/' + pathParts.slice(2).join('/')
  let branch
  try {
    branch = await treeDb.readView({ username, path })
  } catch (e) {
    return four0four
  }

  if (branch?.type === 'page') {
    return {
      html: html`<link-page ...${branch}></link-page>`
    }
  } else if (branch?.type === 'short') {
    return redirect({
      redirect: branch['short-type'],
      url: branch['short-url']
    })
  } else {
    return four0four
  }
}
