import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse'
import { Validator, VALIDATOR } from '@famir/validator'
import { SSEDEV_CONTROLLER } from './ssedev.js'

export class SsedevController extends BaseController {
  static inject(container: DIContainer) {
    container.registerSingleton<SsedevController>(
      SSEDEV_CONTROLLER,
      (c) =>
        new SsedevController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): SsedevController {
    return container.resolve<SsedevController>(SSEDEV_CONTROLLER)
  }

  constructor(validator: Validator, logger: Logger, router: HttpServerRouter) {
    super(validator, logger, router)

    this.logger.debug(`SsedevController initialized`)
  }

  use() {
    this.router.addMiddleware('ssedev', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('ssedev')) {
        message.addRewriteUrlContentTypes(['text/html'])

        if (ctx.url.isPath('/test')) {
          message.setKind('stream-response')
        }
      }

      await next()
    })
  }
}
