import { DIContainer } from '@famir/common'
import { composeCampaign, composeProxy, composeTarget, bootstrap } from '@famir/shell'

try {
  await bootstrap((container: DIContainer) => {
    composeCampaign(container)
    composeProxy(container)
    composeTarget(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
