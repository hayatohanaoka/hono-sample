import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { server } from '../fixtures/exapmle/server.js'

describe('example test', () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    test('should be true', () => {
        expect(true).toBe(true)
    })

    test('responds with the user', async () => {
        const response = await fetch('https://api.example.com/user')
       
        await expect(response.json()).resolves.toEqual({
          id: 'abc-123',
          firstName: 'John',
          lastName: 'Maverick',
        })
    })
})
