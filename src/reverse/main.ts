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
  WellKnownUrlsController,
} from '@famir/reverse-app'
import {
  BrowserleaksController,
  GoogleController,
  HackernewsController,
  HttpbinController,
  ImpersonateController,
  Ja3zoneController,
  TypinksController,
} from './modules/index.js'

export const main: DIComposer = (container) => {
  loadControllers(container)

  useMiddleware(container)
}

const loadControllers: DIComposer = (container) => {
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

  HttpbinController.register(container, {
    custom: {
      title: 'Fake Httpbin',
      github: 'https://github.com/bitnoize/famir-demo',
    },
  })

  TypinksController.register(container)

  Ja3zoneController.register(container)

  BrowserleaksController.register(container)

  HackernewsController.register(container)

  ImpersonateController.register(container)

  GoogleController.register(container)
}

const useMiddleware: DIComposer = (container) => {
  SetupMirrorController.resolve(container).use()

  HttpbinController.resolve(container).pre()
  TypinksController.resolve(container).pre()
  Ja3zoneController.resolve(container).pre()
  BrowserleaksController.resolve(container).pre()
  HackernewsController.resolve(container).pre()
  ImpersonateController.resolve(container).pre()
  GoogleController.resolve(container).pre()

  WellKnownUrlsController.resolve(container).use()
  AuthorizeController.resolve(container).use()
  TransformController.resolve(container).use()

  HttpbinController.resolve(container).act()
  TypinksController.resolve(container).act()
  Ja3zoneController.resolve(container).act()
  BrowserleaksController.resolve(container).act()
  HackernewsController.resolve(container).act()
  ImpersonateController.resolve(container).act()
  GoogleController.resolve(container).act()

  ForwardController.resolve(container).use()
  CompleteController.resolve(container).use()
}
