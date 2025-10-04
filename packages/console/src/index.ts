import { DIContainer } from '@famir/common'
import { composeCampaign, composeProxy, bootstrap } from '@famir/console'

try {
  await bootstrap((container: DIContainer) => {
    composeCampaign(container)
    composeProxy(container)
  })
} catch (error) {
  console.error(`Bootstrap failed`, { error })

  process.exit(1)
}
