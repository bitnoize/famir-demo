import { DIComposer } from '@famir/common'
import {
  AuthorizeController,
  CompleteController,
  RoundTripController,
  SetupMirrorController,
  TransformController,
  WellKnownUrlsController
} from '@famir/reverse'
import { BrowserleaksController, HttpbinController, SsedevController } from './controllers/index.js'

export const composer: DIComposer = (container) => {
  HttpbinController.inject(container)
  SsedevController.inject(container)
  BrowserleaksController.inject(container)

  SetupMirrorController.resolve(container).use()
  WellKnownUrlsController.resolve(container).use()
  AuthorizeController.resolve(container).use()
  TransformController.resolve(container).useAll()
  HttpbinController.resolve(container).use()
  SsedevController.resolve(container).use()
  BrowserleaksController.resolve(container).use()
  RoundTripController.resolve(container).use()
  CompleteController.resolve(container).use()
}
