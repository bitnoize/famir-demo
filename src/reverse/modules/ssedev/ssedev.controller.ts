import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'
import { SSEDEV_CONTROLLER } from './ssedev.js'

export class SsedevController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<SsedevController>(
      SSEDEV_CONTROLLER,
      (c) =>
        new SsedevController(
          c.resolve(VALIDATOR),
          c.resolve(LOGGER),
          c.resolve(TEMPLATER),
          c.resolve(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): SsedevController {
    return container.resolve(SSEDEV_CONTROLLER)
  }

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, router)

    this.logger.debug(`SsedevController initialized`)
  }

  use() {
    this.router.addMiddleware('ssedev', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('ssedev')) {
        message.addRewriteUrlContentTypes(['text/html'])

        if (ctx.url.isPath('/test')) {
          message.setType('normal-stream-response')
        }
      }

      await next()
    })
  }
}
