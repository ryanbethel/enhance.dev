import data from '@begin/data'
import sanitize from 'xss'
import { customAlphabet } from 'nanoid'
const makeId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234569789', 10)

export default {
  create,
  read,
  // TODO: finish reshaping data in database for presenter pattern
  readView: async ({ username, branch }) =>
    _branchPresenter(read({ username, branch })),
  update,
  destroy,
  list,
  makeFlatBranch,
  makeBranchModel,
  // TODO: finish reshaping data in database for presenter pattern
  listView: async ({ username }) =>
    (await list({ username })).branches.map((i) => _branchPresenter(i))
}

function _branchPresenter({ branch }) {
  // const pageAttributes = [
  //   'type',
  //   'path',
  //   'page-title',
  //   'page-subtitle',
  //   'page-description',
  //   'page-logo',
  //   'page-links-0-url',
  //   'page-links-0-text',
  // ]
  // const shortAttributes = ['type', 'path', 'short-url', 'short-type']

  const type = branch.type

  let result
  if (type === 'short') {
    result = {
      type,
      path: branch.path,
      'short-url': branch.short.url,
      'short-type': branch.short.type
    }
  } else if (type === 'page') {
    return {
      type,
      path: branch.path,
      'page-title': branch.page.title,
      'page-subtitle': branch.page.subtitle,
      'page-description': branch.page.subtitle,
      'page-logo': branch.page.logo,
      'page-links-0-text': branch.page.link.text,
      'page-links-0-url': branch.page.link.url
    }
  }
  return result
}

async function destroy({ username, path }) {
  const table = `branches-${username}`
  await data.destroy({
    table,
    key: path
  })
  return { path, flash: [] }
}

async function list({ username }) {
  const table = `branches-${username}`
  const pages = await data.get({
    table,
    limit: 25
  })
  let branches = []
  for await (let branch of pages) {
    delete branch.table
    branches.push(branch)
  }

  branches.sort((a, b) =>
    a.created < b.created ? -1 : a.created > b.created ? 1 : 0
  )

  return { branches, flash: [] }
}

async function read({ username, path }) {
  const table = `branches-${username}`
  try {
    const branch = await data.get({
      table,
      key: path
    })
    return { branch, flash: [] }
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function create({ username, branch: input }) {
  const inputAttributes = [
    ['type', ''],
    ['path', ''],
    ['live', false],
    ['created', ''],
    ['updated', ''],
    ['page-title', ''],
    ['page-subtitle', ''],
    ['page-description', ''],
    ['page-logo', ''],
    ['page-links-0-url', ''],
    ['page-links-0-text', ''],
    ['short-url', ''],
    ['short-type', '']
  ]
  // Sanitize
  let sanitized = {}
  inputAttributes.forEach(([key, defaultValue]) => {
    sanitized[key] = sanitize(input[key]) || defaultValue
  })

  // Validate
  let validation = []
  if (!/[a-zA-Z0-9\/]+/gi.test(sanitized.path))
    validation.push({ field: 'path', message: 'Not a valid Path' })
  if (!(sanitized.type === 'short' || sanitized.type === 'page'))
    validation.push({ field: 'path', message: 'Not a valid Path' })
  let exists = false
  try {
    const found = await read({ username, path: sanitized.path })
    if (found.branch.path) exists = true
    else exists = false
  } catch (e) {
    exists = false
  }
  if (exists) validation.push({ field: 'path', message: 'Path already exists' })

  if (validation.length > 0) {
    return {
      flash: [
        {
          context: 'get-app-branches',
          'initial-values': sanitized,
          message: 'validation errors',
          fields: validation,
          type: 'validation-error',
          id: makeId()
        }
      ]
    }
  }

  // Shape
  let newBranch = {
    type: sanitized.type,
    path: sanitized.path
  }
  if (newBranch.type === 'page')
    newBranch.page = {
      title: sanitized['page-title'],
      subtitle: sanitized['page-subtitle'],
      description: sanitized['page-description'],
      logo: sanitized['page-logo'],
      links: [
        {
          text: sanitized['page-links-0-text'],
          url: sanitized['page-links-0-url']
        }
      ]
    }
  if (newBranch.type === 'short')
    newBranch.short = {
      type: sanitized['short-type'],
      url: sanitized['short-url']
    }
  // Backfill
  newBranch.created = new Date().toISOString()
  newBranch.updated = new Date().toISOString()
  newBranch.live = false

  const table = `branches-${username}`
  // eslint-disable-next-line no-unused-vars
  const { key, ...result } = await data.set({
    table,
    ...newBranch,
    key: newBranch.path
  })
  return { branch: result, flash: [] }
}

async function update({ username, branch: input }) {
  const inputAttributes = [
    ['type', ''],
    ['path', ''],
    ['live', false],
    ['created', ''],
    ['updated', ''],
    ['page-title', ''],
    ['page-subtitle', ''],
    ['page-description', ''],
    ['page-logo', ''],
    ['page-links-0-url', ''],
    ['page-links-0-text', ''],
    ['short-url', ''],
    ['short-type', '']
  ]
  // Sanitize
  let sanitized = {}
  inputAttributes.forEach(([key, defaultValue]) => {
    sanitized[key] = sanitize(input[key]) || defaultValue
  })

  // Get Existing
  const oldBranch = read({ username, path: sanitized.path })

  // Validate
  let validation = []
  if (!/[a-zA-Z0-9\/]+/gi.test(sanitized.path))
    validation.push({ field: 'path', message: 'Not a valid Path' })
  if (!(sanitized.type === 'short' || sanitized.type === 'page'))
    validation.push({
      field: 'path',
      message: 'type must be "short" or "page"'
    })

  if (validation.length > 0) {
    return {
      flash: [
        {
          context: 'get-app-branches',
          'initial-values': sanitized,
          message: 'validation errors',
          fields: validation,
          type: 'validation-error',
          id: makeId()
        }
      ]
    }
  }

  // Shape
  let newBranch = {
    type: sanitized.type,
    path: sanitized.path
  }
  if (newBranch.type === 'page')
    newBranch.page = {
      title: sanitized['page-title'],
      subtitle: sanitized['page-subtitle'],
      description: sanitized['page-description'],
      logo: sanitized['page-logo'],
      links: [
        {
          text: sanitized['page-links-0-text'],
          url: sanitized['page-links-0-url']
        }
      ]
    }
  if (newBranch.type === 'short')
    newBranch.short = {
      type: sanitized['short-type'],
      url: sanitized['short-url']
    }
  // Backfill
  newBranch.created = oldBranch.created
  newBranch.updated = new Date().toISOString()
  newBranch.live = sanitized.live

  const table = `branches-${username}`
  // eslint-disable-next-line no-unused-vars
  const { key, ...result } = await data.set({
    table,
    ...newBranch,
    key: newBranch.path
  })
  return { branch: result, flash: [] }
}

function makeBranchModel(i = {}) {
  const { type, path, live, created, updated } = i
  let output = {
    type,
    path,
    live,
    created,
    updated
  }
  if (type === 'page') {
    output.page = {
      title: i['page-title'],
      subtitle: i['page-subtitle'],
      description: i['page-description'],
      logo: i['page-logo'],
      links: [
        {
          url: i['page-links-0-url'],
          text: i['page-links-0-text']
        }
      ]
    }
  }
  if (type === 'short') {
    output.short = {
      url: i['short-url'],
      text: i['short-type']
    }
  }
  return output
}
function makeFlatBranch(i = {}) {
  const { type = '', path = '', live = '', created = '', updated = '' } = i
  let output = {
    type,
    path,
    live,
    created,
    updated
  }

  if (type === 'page') {
    output['page-title'] = i?.page?.title
    output['page-subtitle'] = i?.page?.subtitle
    output['page-description'] = i?.page?.description
    output['page-logo'] = i?.page?.logo
    output['page-links-0-url'] = i?.page?.links[0]?.url
    output['page-links-0-text'] = i?.page?.links[0]?.text
  }
  if (type === 'short') {
    output['short-url'] = i?.short?.url
    output['short-type'] = i?.short?.type
  }
  return output
}
