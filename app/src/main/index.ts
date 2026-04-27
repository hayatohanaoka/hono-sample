import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import v1Handler from './rest/api/v1/handler.js'
import systemsHandler from './rest/v1/systemsHandler.js'

const app = new Hono()

app.route('/api/v1', v1Handler)
app.route('v1/systems', systemsHandler)

serve({
  fetch: app.fetch,
  port: 13000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
