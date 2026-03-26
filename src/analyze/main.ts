import { DummyController } from '@famir/analyze'
import { DIComposer } from '@famir/common'
import { ConsumeSpecs } from '@famir/consume'
import { ANALYZE_QUEUE_NAME } from '@famir/produce'

export const composer: DIComposer = (container) => {
  DummyController.resolve(container).use()
}

export const specs: ConsumeSpecs = [
  [
    ANALYZE_QUEUE_NAME,
    {
      concurrency: 2,
      limiterMax: 1,
      limiterDuration: 1000
    }
  ]
]
