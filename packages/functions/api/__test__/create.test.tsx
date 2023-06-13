import { describe, expect, it } from 'vitest'
import * as create from '../create'


describe('Testing createSubscriber function', () => {

  it('throws error if parameter is missing email_address', async () => {
    const event = {
      body: `{
        "tech_subscribed": 1
      }`
    }
    const result = await create.handler(event)
    expect(result.statusCode).toBe(500)
    expect(result.message).toBe("Email address is undefined")
  })

  it('throws error if response is missing email_address', async () => {
    // const event = {
    //   body: `{
    //     "tech_subscribed": 1
    //   }`
    // }
    // const result = await create.handler(event)
    // expect(result.statusCode).toBe(500)
    // expect(result.message).toBe("Email address is undefined")
  })
})