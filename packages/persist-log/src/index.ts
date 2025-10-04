import { DIContainer } from '@famir/common'
import { bootstrap, composeDummy } from '@famir/persist-log'

try {
  await bootstrap((container: DIContainer) => {
    composeDummy(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
