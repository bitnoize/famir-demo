import { DIContainer } from '@famir/common'
import {
  composeAuthorizeModule,
  composeSetupMirrorModule,
  composeBuildRequestModule,
  composeBuildResponseModule,
  composeWellKnownUrlsModule,
  composeCompletionModule,
  bootstrapDefault
} from '@famir/reverse-proxy'
import { composeHttpbinModule } from './controllers/index.js'

try {
  await bootstrapDefault((container: DIContainer) => {
    composeSetupMirrorModule(container)
    composeBuildRequestModule(container)
    composeWellKnownUrlsModule(container)
    composeAuthorizeModule(container)
    composeHttpbinModule(container)
    composeBuildResponseModule(container)
    composeCompletionModule(container)
  })
} catch (error) {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
}
