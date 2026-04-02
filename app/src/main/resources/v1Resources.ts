import { Hono } from "hono"

const v1 = new Hono()

v1.get('/systems/ping', (c) => {
    return c.text('pong')
})

export default v1
