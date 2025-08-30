import { DIContainer } from '@famir/common'
import { composeGateway, composePreflightCors, bootstrap } from '@famir/reverse-proxy'
try {
  await bootstrap((container: DIContainer) => {
    composePreflightCors(container)
    composeGateway(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
