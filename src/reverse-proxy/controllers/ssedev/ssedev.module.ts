import { DIContainer } from '@famir/common'
import { SsedevController } from './ssedev.controller.js'

export const composeSsedevModule = (container: DIContainer): SsedevController => {
  SsedevController.inject(container)

  return SsedevController.resolve(container)
}
