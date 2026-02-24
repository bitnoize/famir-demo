import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-proxy'
import { Validator, VALIDATOR } from '@famir/validator'

export const BROWSERLEAKS_CONTROLLER = Symbol('BrowserleaksController')

export class BrowserleaksController extends BaseController {
  static inject(container: DIContainer) {
    container.registerSingleton<BrowserleaksController>(
      BROWSERLEAKS_CONTROLLER,
      (c) =>
        new BrowserleaksController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): BrowserleaksController {
    return container.resolve<BrowserleaksController>(BROWSERLEAKS_CONTROLLER)
  }

  constructor(validator: Validator, logger: Logger, router: HttpServerRouter) {
    super(validator, logger, router)

    this.logger.debug(`BrowserleaksController initialized`)
  }

  use() {
    this.router.register('browserleaks', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('browserleaks')) {
        message.addRewriteUrlTypes('text/html', 'text/css', 'application/javascript')
      }

      await next()
    })
  }
}
