import { DIContainer } from '@famir/common'
import {
  composeAuthorizeModule,
  composeConfigureModule,
  composeBuildRequestModule,
  composeBuildResponseModule,
  composeWellKnownUrlsModule,
  composeCompleteModule,
  bootstrap
} from '@famir/reverse-proxy'

try {
  await bootstrap((container: DIContainer) => {
    composeConfigureModule(container)
    composeBuildRequestModule(container)
    composeWellKnownUrlsModule(container)
    composeAuthorizeModule(container)
    composeBuildResponseModule(container)
    composeCompleteModule(container)
  })
} catch (error) {
  console.error(`Bootstrap error`, { error })

  process.exit(1)
}
