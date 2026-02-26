import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse'
import { Validator, VALIDATOR } from '@famir/validator'

export const HTTPBIN_CONTROLLER = Symbol('HttpbinController')

export class HttpbinController extends BaseController {
  static inject(container: DIContainer) {
    container.registerSingleton<HttpbinController>(
      HTTPBIN_CONTROLLER,
      (c) =>
        new HttpbinController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): HttpbinController {
    return container.resolve<HttpbinController>(HTTPBIN_CONTROLLER)
  }

  constructor(validator: Validator, logger: Logger, router: HttpServerRouter) {
    super(validator, logger, router)

    this.logger.debug(`HttpbinController initialized`)
  }

  use() {
    this.router.register('httpbin', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('httpbin')) {
        message.addRewriteUrlTypes('text/html')

        if (ctx.url.isPathEquals('/post')) {
          message.setKind('stream-request')
        }

        if (ctx.url.isPathUnder('/stream')) {
          message.setKind('stream-response')
        }
      }

      await next()
    })
  }
}
