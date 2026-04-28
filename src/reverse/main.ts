import { DIComposer } from '@famir/common'
import {
  AuthorizeController,
  AuthorizeService,
  CompleteController,
  CompleteService,
  ForwardController,
  ForwardService,
  SetupMirrorController,
  SetupMirrorService,
  TransformController,
  WellKnownUrlsController
} from '@famir/reverse-app'
import {
  BrowserleaksController,
  GoogleController,
  HackernewsController,
  HttpbinController,
  Ja3zoneController,
  SsedevController
} from './modules/index.js'

export const main: DIComposer = (container) => {
  SetupMirrorService.register(container)
  SetupMirrorController.register(container)

  WellKnownUrlsController.register(container)

  AuthorizeService.register(container)
  AuthorizeController.register(container)

  TransformController.register(container)

  ForwardService.register(container)
  ForwardController.register(container)

  CompleteService.register(container)
  CompleteController.register(container)

  HttpbinController.register(container)
  SsedevController.register(container)
  Ja3zoneController.register(container)
  BrowserleaksController.register(container)
  GoogleController.register(container)
  HackernewsController.register(container)

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
  ForwardController.resolve(container).use()
  CompleteController.resolve(container).use()
}
