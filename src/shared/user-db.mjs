import data from '@begin/data'
const table = 'user-table'
export default {
  create,
  read,
  readByGithub,
  update,
  destroy,
  list
}

async function destroy({ username }) {
  await data.destroy({ table, key: username })
  return { username, flash: [] }
}
async function update(user) {
  let exists = false
  try {
    const found = await read({ username: user.username })
    if (found.username) exists = true
  } catch (e) {
    exists = false
  }
  if (!exists) throw new Error('user not found')
  // eslint-disable-next-line no-unused-vars
  const { key, ...rest } = await data.set({
    table,
    key: user.username,
    ...user
  })
  return { user: rest, flash: [] }
}
async function create(user) {
  let exists = false
  try {
    const found = await read({ username: user.username })
    if (found.username) exists = true
  } catch (e) {
    exists = false
  }
  if (exists) throw new Error('user already exists')
  // eslint-disable-next-line no-unused-vars
  const { key, ...rest } = await data.set({
    table,
    key: user.username,
    ...user
  })
  return { user: rest, flash: [] }
}

async function read({ username }) {
  // eslint-disable-next-line no-unused-vars
  const { key, ...user } = await data.get({ table, key: username })
  return { user, flash: [] }
}
async function readByGithub({ github }) {
  const users = await data.get({ table })
  return users.filter((u) => u.github.login === github)[0]
}
async function list() {
  const pages = await data.get({
    table,
    limit: 25
  })
  let users = []
  for await (let user of pages) {
    // eslint-disable-next-line no-unused-vars
    const { table, key, ...next } = user
    users.push(next)
  }

  users.sort((a, b) =>
    a.lastName < b.lastName ? -1 : a.lastName > b.lastName ? 1 : 0
  )

  return { users, flash: [] }
}
