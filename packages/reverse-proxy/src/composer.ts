import { DIComposer } from '@famir/common'
import {
  composeAuthorizeModule,
  composeRoundTripModule,
  composeSetupMirrorModule,
  composeWellKnownUrlsModule
} from '@famir/reverse-proxy'
import { composeHttpbinModule } from './controllers/index.js'

export const composer: DIComposer = (container) => {
  const setupMirror = composeSetupMirrorModule(container)
  const wellKnownUrls = composeWellKnownUrlsModule(container)
  const authorize = composeAuthorizeModule(container)
  const roundTrip = composeRoundTripModule(container)
  const httpbin = composeHttpbinModule(container)

  setupMirror.use()
  wellKnownUrls.useAll()
  authorize.use()
  roundTrip.useInitMessage()
  roundTrip.useBasicTransforms()
  httpbin.use()
  //browserleaks.use()
  roundTrip.useForwardMessage()
  roundTrip.useCreateMessage()
}
