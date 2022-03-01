import arc from '@architect/functions'
import sandbox from '@architect/sandbox'
import test from 'tape'
process.env.ARC_ENV
process.env.ARC_SANDBOX = JSON.stringify({
  ports: { tables: 5555, _arc: 2222 }
})

test('start sandbox', async (t) => {
  t.plan(1)
  const output = await sandbox.start()
  t.equal(output, 'Sandbox successfully started', 'sandbox started')
})

test('create a new org without error', async (t) => {
  t.plan(1)
  const db = await arc.tables()
  console.log('db-------------------------', db)
  t.pass('create org happened')
})

test('sandbox end', async (t) => {
  t.plan(1)
  const output = await sandbox.end()
  t.equal(output, 'Sandbox successfully shut down', 'sandbox end')
})
