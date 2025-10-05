import { DIContainer } from '@famir/common'
import {
  composeCampaign,
  composeProxy,
  composeTarget,
  composeLure,
  bootstrap,
  composeRedirector,
  composeSession,
  composeMessage
} from '@famir/console'

try {
  await bootstrap((container: DIContainer) => {
    composeCampaign(container)
    composeProxy(container)
    composeTarget(container)
    composeRedirector(container)
    composeLure(container)
    composeSession(container)
    composeMessage(container)
  })
} catch (error) {
  console.error(`Bootstrap failed`, { error })

  process.exit(1)
}
