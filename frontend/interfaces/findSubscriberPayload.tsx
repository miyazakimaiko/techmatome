import { Subscriber } from "./subscriber"

export interface FindSubscriberPayload {
  found: boolean
  data: Subscriber | undefined
}