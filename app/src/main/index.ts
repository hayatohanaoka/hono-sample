import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import v1Resources from './rest/v1/handler.js'

const app = new Hono()

app.route('/api/v1', v1Resources)

serve({
  fetch: app.fetch,
  port: 13000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
