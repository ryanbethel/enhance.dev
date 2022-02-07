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
    create,
    update,
    destroy,
    list,
    flashRemove,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe
    // createUser,
    // updateUser,
    // destroyUser,
    // listUsers,
  }
}

function mutate(e) {
  const { data } = e
  const { result, type } = data
  switch (type) {
    case CREATE:
      if (result.flash && result.flash.length) flashMutation(result)
      else createMutation(result)
      break
    case UPDATE:
      if (result.flash && result.flash.length) flashMutation(result)
      else updateMutation(result)
      break
    case DESTROY:
      if (result.flash && result.flash.length) flashMutation(result)
      else destroyMutation(result)
      break
    case LIST:
      if (result.flash && result.flash.length) flashMutation(result)
      else listMutation(result)
      break
  }
}

function flashRemove({ id }) {
  let copy = store.flash.slice()
  copy.splice(
    copy.findIndex((i) => i.id === id),
    1
  )
  store.flash = copy
}

function flashMutation(result) {
  if (!store.flash) store.initialize({ flash: [] })
  let copy = store.flash.slice()
  copy = [...copy, ...result.flash]
  store.flash = copy
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
