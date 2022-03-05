// eslint-disable-next-line import/no-unresolved
import Store from 'https://unpkg.com/@begin/store'
const store = Store()

const CREATE = 'create'
const UPDATE = 'update'
const DESTROY = 'destroy'
const LIST = 'list'

let worker
export default function API() {
  if (!worker) {
    worker = new Worker('/components/data/worker.mjs')
    worker.onmessage = mutate
  }

  return {
    repl,
    create,
    update,
    destroy,
    list,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe
  }
}

function mutate(e) {
  const { data } = e
  const { result, type } = data
  switch (type) {
    case CREATE:
      createMutation(result)
      break
    case UPDATE:
      updateMutation(result)
      break
    case DESTROY:
      destroyMutation(result)
      break
    case LIST:
      listMutation(result)
      break
  }
}

function createMutation(result) {
  const copy = store.branches.slice()
  copy.push(result.branch)
  store.branches = copy
}

function updateMutation(result) {
  const copy = store.branches.slice()
  copy.splice(
    copy.findIndex((i) => i.path === result.branch.path),
    1,
    result.branch
  )
  store.branches = copy
}

function destroyMutation(result) {
  let copy = store.branches.slice()
  copy.splice(
    copy.findIndex((i) => i.path === result.path),
    1
  )
  store.branches = copy
}

function listMutation(result) {
  store.initialize({ branches: result.branches || [] })
}

function create(branch) {
  worker.postMessage({
    type: CREATE,
    data: branch
  })
}

function destroy(branch) {
  worker.postMessage({
    type: DESTROY,
    data: branch
  })
}

function list() {
  worker.postMessage({
    type: LIST
  })
}

function update(branch) {
  worker.postMessage({
    type: UPDATE,
    data: branch
  })
}

const repl = {
  create: function ({ name, doc }) {
    try {
      if (!store[name]) store[name] = doc
    } catch (e) {
      console.log(e)
    }
  },

  update: function ({ name, doc }) {
    store[name] = doc
  }
}
