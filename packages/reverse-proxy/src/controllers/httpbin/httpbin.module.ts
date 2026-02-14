import { DIContainer } from '@famir/common'
import { HttpbinController } from './httpbin.controller.js'

export const composeHttpbinModule = (container: DIContainer): HttpbinController => {
  HttpbinController.inject(container)

  return HttpbinController.resolve(container)
}
