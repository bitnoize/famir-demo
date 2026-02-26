import { DIContainer } from '@famir/common'
import { BrowserleaksController } from './browserleaks.controller.js'

export const composeBrowserleaksModule = (container: DIContainer): BrowserleaksController => {
  BrowserleaksController.inject(container)

  return BrowserleaksController.resolve(container)
}
