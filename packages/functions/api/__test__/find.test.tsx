import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as find from '../find'
import { errorResponse } from '../common/responses'
import { NotFoundError } from '../common/errors'

describe('Testing SubscriberCreationService', () => {

  let mockDbClient: any
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

    service = find.SubscriberFindService(mockDbClient)
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
        .rejects.toThrowError("Email query string parameter is required")
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

  describe('Testing main method', () => {

    it('returns error response if subscriber is not found', async () => {
      mockDbClient.db.subscriber.filter = () => ({
        getMany: () => ([])
      })
      const event = {
        queryStringParameters: {
          email: "test@test.com"
        }
      }
      const response = await service.main(event)
      const expectedRes = errorResponse(new NotFoundError("Could not find subscriber"))
      expect(response).toEqual(expectedRes)
    })
          
    it('returns success response if subscriber is found', async () => {
      const email = "test@test.com"
      
      mockDbClient.db.subscriber.filter = () => ({
        getMany: () => ([{ "email_address": email }])
      })
      const event = {
        queryStringParameters: {
          email
        }
      }
      const response = await service.main(event)
      const expectedRes = {
        statusCode: 200,
        body: JSON.stringify({
          found: true,
          data: { email_address: email }
        })
      }
      expect(response).toEqual(expectedRes)
    })
  })
})