import { describe, test, expect } from 'vitest'

describe('GET /v1/systems/ping', () => {
    // wip
    test.skip('pongが返る', async () => {
        const response = await fetch('http://localhost:13000/v1/systems/ping')
        expect(response.status).toBe(200)
    })
})
