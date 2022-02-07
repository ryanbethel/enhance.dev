import arc from '@architect/functions'
import github from './github.mjs'
import userDb from '@architect/shared/user-db.mjs'

export const handler = arc.http.async(auth)

async function auth(req) {
  const {
    query: { code }
  } = req
  if (code) {
    try {
      const githubAccount = await github(req)
      const user = await userDb.readByGithub({ github: githubAccount.login })
      return {
        session: { user },
        location: '/app/branches'
      }
    } catch (err) {
      return {
        statusCode: err.code,
        body: err.message
      }
    }
  } else {
    return {
      statusCode: 302,
      location: '/'
    }
  }
}
