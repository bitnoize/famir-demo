import { composeDummyModule } from '@famir/analyze'
import { DIComposer } from '@famir/common'
import { ExecutorWorkerSpecs } from '@famir/executor'
import { ANALYZE_QUEUE_NAME } from '@famir/workflow'

export const composer: DIComposer = (container) => {
  const dummy = composeDummyModule(container)

  dummy.use()
}

export const specs: ExecutorWorkerSpecs = {
  [ANALYZE_QUEUE_NAME]: {
    concurrency: 2,
    limiterMax: 1,
    limiterDuration: 1000
  }
} as const
