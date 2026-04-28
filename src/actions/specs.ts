import { ConsumeSpecs } from '@famir/consume'
import { ANALYZE_QUEUE_NAME } from '@famir/produce'

export const specs: ConsumeSpecs = new Map([
  [
    ANALYZE_QUEUE_NAME,
    {
      concurrency: 2,
      limiterMax: 1,
      limiterDuration: 1000
    }
  ]
])
