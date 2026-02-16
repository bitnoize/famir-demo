import { DIComposer } from '@famir/common'
import {
  composeAuthorizeModule,
  composeRoundTripModule,
  composeSetupMirrorModule,
  composeWellKnownUrlsModule,
  composeTransformModule
} from '@famir/reverse-proxy'
import { composeHttpbinModule, composeBrowserleaksModule } from './controllers/index.js'

export const composer: DIComposer = (container) => {
  const setupMirror = composeSetupMirrorModule(container)
  const wellKnownUrls = composeWellKnownUrlsModule(container)
  const authorize = composeAuthorizeModule(container)
  const roundTrip = composeRoundTripModule(container)
  const transform = composeTransformModule(container)
  const httpbin = composeHttpbinModule(container)
  const browserleaks = composeBrowserleaksModule(container)

  setupMirror.use()
  wellKnownUrls.use()
  authorize.use()
  roundTrip.useInit()
  transform.useAll()
  httpbin.use()
  browserleaks.use()
  roundTrip.useForward()
  roundTrip.useSaveLog()
}
