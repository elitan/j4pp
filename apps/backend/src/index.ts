import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import { appRouter } from './trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { spawnSync } from 'bun'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono()

app.use('*', logger())

app.use('/api/trpc/*', async (c) => {
  const res = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  })
  return res
})

app.use('/api/test', async (c) => {
  // for spawnSync, it is a property on the return value
  const { resourceUsage } = spawnSync([
    'bun',
    '-e',
    "console.log('Hello world!')",
  ])

  console.log(resourceUsage)

  return c.json({ message: 'Hello World' })
})

app.use('/static/*', serveStatic({ root: './static' }))
app.get('*', serveStatic({ path: './dist/index.html' }))

app.get('/ui', swaggerUI({ url: '/doc' }))
const port = 3001
console.log(`Server running at http://localhost:${port}`)

export default {
  port: 3001,
  fetch: app.fetch,
}
