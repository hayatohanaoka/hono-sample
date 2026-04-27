import { describe, test, expect } from 'vitest'

describe('GET /v1/systems/ping', () => {
    test('pongが返る', async () => {
        const response = await fetch('http://127.0.0.1:13000/v1/systems/ping')
        expect(response.status).toBe(200)
    })
})
