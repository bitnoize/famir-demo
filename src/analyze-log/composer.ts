import { DIComposer } from '@famir/common'
import { composeDummyModule } from '@famir/analyze-log'

export const composer: DIComposer = (container) => {
  const dummy = composeDummyModule(container)

  dummy.use()
}
