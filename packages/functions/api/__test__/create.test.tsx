import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as create from '../create'
import { successResponse, errorResponse } from '../common/responses'
import { BadRequestError } from '../common/errors'

describe('Testing SubscriberCreationService', () => {

  let mockDbClient: any
  let mockSnsClient: any
  let service: any

  beforeEach(() => {
    mockDbClient = {
      db: {
        subscriber: {
          create: () => ({})
        }
      }
    }
    mockSnsClient = {
      send: () => ({})
    }
    service = create.SubscriberCreationService(mockDbClient, mockSnsClient)

    vi.mock("sst/node/topic", () => {
      const Topic = {
        SubscriberCreationTopic: {
          topicArn: "test"
        }
      }
      return { Topic }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Testing validateEventBody method', () => {
      
    it('throws error if parameter is missing email_address', async () => {
      const event = {
        body: JSON.stringify({
          "tech_subscribed": 1
        })
      }
      expect(() => service.validateEventBody(event))
        .rejects.toThrowError('Invalid body')
    })

    it('throws error if parameter includes additional properties', async () => {
      const event = {
        body: JSON.stringify({
          "invalid_param": 1
        })
      }
      expect(() => service.validateEventBody(event)
        .rejects.toThrowError('Invalid body'))
    })

    it('throws error if email_address is not a string', async () => {
      const event = {
        body: JSON.stringify({
          "email_address": 1
        })
      }
      expect(() => service.validateEventBody(event)
        .rejects.toThrowError('Invalid body'))
    })

    it('throws error if tech_subscribed is not a number', async () => {
      const event = {
        body: JSON.stringify({
          "email_address": "test",
          "tech_subscribed": "1"
        })
      }
      expect(() => service.validateEventBody(event)
        .rejects.toThrowError('Invalid body'))
    })

    it('throws error if web_subscribed is not a number', async () => {
      const event = {
        body: JSON.stringify({
          "email_address": "test",
          "web_subscribed": "1"
        })
      }
      expect(() => service.validateEventBody(event)
        .rejects.toThrowError('Invalid body'))
    })

    it('throws error if crypto_subscribed is not a number', async () => {
      const event = {
        body: JSON.stringify({
          "email_address": "test",
          "crypto_subscribed": "1"
        })
      }
      expect(() => service.validateEventBody(event)
        .rejects.toThrowError('Invalid body'))
    })

    it('returns body if event body is valid', async () => {
      const event = {
        body: JSON.stringify({
          "email_address": "test",
          "tech_subscribed": 1,
          "web_subscribed": 1
        })
      }
      const result = await service.validateEventBody(event)
      expect(result).toStrictEqual({
        "email_address": "test",
        "tech_subscribed": 1,
        "web_subscribed": 1
      })
    })
  })

  describe('Testing createSubscriber method', () => {

    it('throws error if response is missing email_address', async () => {
      mockDbClient.db.subscriber.create = () => {
        return {"invalid_email_address": "test"}
      }
      expect(() => service.createSubscriber({
        email_address: "test",
        tech_subscribed: 1
      })).rejects.toThrowError('Could not get email_address from response')
    })

    it('returns response if email_address is present', async () => {
      mockDbClient.db.subscriber.create = () => {
        return {"email_address": "test"}
      }
      const result = await service.createSubscriber({
        email_address: "test",
        tech_subscribed: 1
      })
      expect(result).toStrictEqual({"email_address": "test"})
    })
  })

  describe('Testing sendSubscriberCreationTopic method', () => {
      
    it('throws error if snsClient.send throws error', async () => {
      mockSnsClient.send = () => {
        throw new Error('test')
      }
      expect(() => service.sendSubscriberCreationTopic({
        email_address: "test",
        tech_subscribed: 1
      })).rejects.toThrowError()
    })

    it('returns response if email_address is present', async () => {
      mockSnsClient.send = () => {
        return {"email_address": "test"}
      }
      const result = await service.sendSubscriberCreationTopic({
        email_address: "test",
        tech_subscribed: 1
      })
      expect(result).toStrictEqual({"email_address": "test"})
    })
  })

  describe('Testing handler method returning values', () => {

    it('throws error if event is invalid', async () => {
      const event = {
        body: JSON.stringify({
          "invalid_key": "test",
          "tech_subscribed": 1
        })
      }
      const result = await service.main(event)
      const errRes = errorResponse(new BadRequestError('Invalid body'))

      expect(result).toStrictEqual(errRes)
    })

    it('returns response if event is valid', async () => {
      mockDbClient.db.subscriber.create = () => {
        return {"email_address": "test"}
      }
      const event = {
        body: JSON.stringify({
          "email_address": "test",
          "tech_subscribed": 1
        })
      }
      const result = await service.main(event)
      const successRes = successResponse("created")

      expect(result).toStrictEqual(successRes)
    })
  })
})