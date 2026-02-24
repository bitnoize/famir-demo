import { DIComposer } from '@famir/common'
import {
  composeAuthorizeModule,
  composeRoundTripModule,
  composeSetupMirrorModule,
  composeTransformModule,
  composeWellKnownUrlsModule
} from '@famir/reverse-proxy'
import {
  composeBrowserleaksModule,
  composeHttpbinModule,
  composeSsedevModule
} from './controllers/index.js'

export const composer: DIComposer = (container) => {
  const setupMirror = composeSetupMirrorModule(container)
  const wellKnownUrls = composeWellKnownUrlsModule(container)
  const authorize = composeAuthorizeModule(container)
  const roundTrip = composeRoundTripModule(container)
  const transform = composeTransformModule(container)
  const httpbin = composeHttpbinModule(container)
  const ssedev = composeSsedevModule(container)
  const browserleaks = composeBrowserleaksModule(container)

  setupMirror.use()
  wellKnownUrls.use()
  authorize.use()
  roundTrip.useInit()
  transform.useAll()
  httpbin.use()
  ssedev.use()
  browserleaks.use()
  roundTrip.useForward()
  roundTrip.useSaveLog()
}
