import { DIContainer } from '@famir/common'
import {
  HTTP_SERVER_ROUTER,
  HttpServerMiddleware,
  HttpServerRouter,
  Logger,
  LOGGER,
  Validator,
  VALIDATOR,
  testTargetHasLabel
} from '@famir/domain'
import { BaseController } from '@famir/reverse-proxy'

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

    this.router.register('httpbin', this.httpbin)

    this.logger.debug(`HttpbinController initialized`)
  }

  private httpbin: HttpServerMiddleware = async (ctx, next) => {
    const target = this.getState(ctx, 'target')

    if (testTargetHasLabel(target, 'httpbin')) {

    }

    await next()
  }
}
