let tiny from 'tiny-json-http')
let arc from '@architect/functions')
let sandbox from '@architect/sandbox')
let test from 'tape')

test('start sandbox', async (t) => {
  t.plan(1)
  const output = await sandbox.start()
  t.equal(output, 'Sandbox successfully started', 'sandbox started')
})

test('create a new org without error', async (t) => {
  t.plan(1)
  const db = await arc.tables()
  const newOrg = await entityDb.ORG.create(
    {
      name: 'A Good Org',
      accountStatus: constant.ACCOUNT_STATUS.ORG_PAID
    },
    { db, table }
  )
  t.pass('create org happened')
})

test('read org ', async (t) => {
  const db = await arc.tables()
  t.plan(3)
  const org = await entityDb.ORG.create(
    {
      name: 'A Good Org',
      accountStatus: constant.ACCOUNT_STATUS.ORG_PAID
    },
    { db, table }
  )
  const sameOrg = await entityDb.ORG.read({ orgId: org.orgId }, { db, table })
  t.ok(
    org.orgId === sameOrg.orgId &&
      org.ownerId === sameOrg.ownerId &&
      org.createdAt === sameOrg.createdAt &&
      org.modifiedAt === sameOrg.modifiedAt &&
      org.accountStatus === sameOrg.accountStatus,
    'organization matches'
  )
  const matchConditionalRead = await entityDb.ORG.read(
    { orgId: org.orgId },
    { db, table, condition: { owner: ['', org.orgId] } }
  )
  t.ok(
    org.orgId === matchConditionalRead.orgId,
    'organization matches for conditional read'
  )
  const nonMatchConditionalRead = await entityDb.ORG.read(
    { orgId: org.orgId },
    { db, table, condition: { owner: ['', 'no-way'] } }
  )
  t.ok(
    nonMatchConditionalRead === null,
    'organization fails for non-match conditional read'
  )
})

test('sandbox end', async (t) => {
  t.plan(1)
  const output = await sandbox.end()
  t.equal(output, 'Sandbox successfully shut down', 'sandbox end')
})
