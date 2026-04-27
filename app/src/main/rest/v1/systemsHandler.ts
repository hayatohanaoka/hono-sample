import { Hono } from "hono"

const systemsHandler = new Hono()

systemsHandler.get('/ping', (c) => {
    return c.text('pong')
})

export default systemsHandler
