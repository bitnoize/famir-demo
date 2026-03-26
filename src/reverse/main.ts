import { DIComposer } from '@famir/common'
import {
  AuthorizeController,
  CompleteController,
  RoundTripController,
  SetupMirrorController,
  TransformController,
  WellKnownUrlsController
} from '@famir/reverse'
import {
  BrowserleaksController,
  GoogleController,
  HackernewsController,
  HttpbinController,
  Ja3zoneController,
  SsedevController
} from './controllers/index.js'

export const composer: DIComposer = (container) => {
  HttpbinController.inject(container)
  SsedevController.inject(container)
  Ja3zoneController.inject(container)
  BrowserleaksController.inject(container)
  GoogleController.inject(container)
  HackernewsController.inject(container)

  SetupMirrorController.resolve(container).use()
  WellKnownUrlsController.resolve(container).use()
  HackernewsController.resolve(container).usePre()
  AuthorizeController.resolve(container).use()
  TransformController.resolve(container).use()
  HttpbinController.resolve(container).use()
  SsedevController.resolve(container).use()
  Ja3zoneController.resolve(container).use()
  BrowserleaksController.resolve(container).use()
  GoogleController.resolve(container).use()
  HackernewsController.resolve(container).use()
  RoundTripController.resolve(container).use()
  CompleteController.resolve(container).use()
}
