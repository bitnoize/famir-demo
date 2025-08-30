import { DIContainer } from '@famir/common'
import { bootstrap, composeHeartbeat } from '@famir/heartbeat'

try {
  await bootstrap((container: DIContainer) => {
    composeHeartbeat(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
