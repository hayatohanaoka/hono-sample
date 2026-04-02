import { describe, test, expect } from 'vitest'

describe('GET /api/v1/systems/ping', () => {
    test('pongが返る', async () => {
        const response = await fetch('http://localhost:13000/api/v1/systems/ping')
        expect(response.status).toBe(200)
    })
})
