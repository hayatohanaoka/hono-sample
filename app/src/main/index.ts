import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/v1/systems/ping', (c) => {
  return c.text('pong')
})

serve({
  fetch: app.fetch,
  port: 13000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
