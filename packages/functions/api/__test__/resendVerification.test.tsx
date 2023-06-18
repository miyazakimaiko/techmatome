import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as resend from '../resendVerification'
import { successResponse, errorResponse } from '../common/responses'
import { BadRequestError } from '../common/errors'

describe('Testing ResendVerificationService', () => {

  let mockDbClient: any
  let mockSnsClient: any
  let service: any

  beforeEach(() => {
    mockDbClient = {
      db: {
        subscriber: {
          filter: ({}) => ({
            getMany: () => ([{}])
          })
        }
      }
    }
    mockSnsClient = {
      send: () => ({})
    }
    service = resend.ResendVerificationService(mockDbClient, mockSnsClient)

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

  describe('Testing validateEventQueryStringParam method', () => {
      
    it('throws error if queryStringParameters is missing email', async () => {
      const event = {
        queryStringParameters: {}
      }
      expect(() => service.validateEventQueryStringParam(event))
        .rejects.toThrowError("Missing email queryStringParameter")
    })

    it('returns response if email is present', async () => {
      const event = {
        queryStringParameters: {
          email: "test@test.com"
        }
      }
      const response = await service.validateEventQueryStringParam(event)
      expect(response).toEqual(event.queryStringParameters)
    })
  })

  describe('Testing findSubscriber method', () => {
        
    it('throws error if subscriber is not found', async () => {
      mockDbClient.db.subscriber.filter = () => ({
        getMany: () => ([])
      })
      expect(() => service.findSubscriber("email@test.com"))
      .rejects.toThrowError("Could not find subscriber")
    })

    it('returns subscriber if found', async () => {
      const email = "test@test.com"
      mockDbClient.db.subscriber.filter = () => ({
        getMany: () => ([{ "email_address": email }])
      })
      const response = await service.findSubscriber(email)
      expect(response).toEqual({ "email_address": email })
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
      expect(result).toBe(true)
    })
  })

  describe('Testing handler method returning values', () => {

    it('throws error if event is invalid', async () => {
      const event = {
        queryStringParameters: {
          invalidParam: "test@test.com"
        }
      }
      const result = await service.main(event)
      const err = new BadRequestError('Missing email queryStringParameter')
      const errRes = errorResponse(err)

      expect(result).toStrictEqual(errRes)
    })

    it('returns response if event is valid', async () => {
      mockDbClient.db.subscriber.filter = () => ({
        getMany: () => ([{ "email_address": "test@test.com" }])
      })
      const event = {
        queryStringParameters: {
          email: "test@test.com"
        }
      }
      const result = await service.main(event)
      const successRes = successResponse("resent")

      expect(result).toStrictEqual(successRes)
    })
  })
})