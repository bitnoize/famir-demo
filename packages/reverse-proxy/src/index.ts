import { DIContainer } from '@famir/common'
import { composeConfiguration, composePreflightCors, bootstrap } from '@famir/reverse-proxy'
try {
  await bootstrap((container: DIContainer) => {
    composePreflightCors(container)
    composeConfiguration(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
