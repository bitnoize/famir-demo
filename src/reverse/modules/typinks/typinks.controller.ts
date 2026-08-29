import { DIContainer } from '@famir/common'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerAssets,
  HttpServerRouter
} from '@famir/http-server'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'

/**
 * DI token for the typinks controller.
 *
 * @category Typinks
 */
export const TYPINKS_CONTROLLER = Symbol('TypinksController')

/**
 * Represents the typinks controller.
 *
 * @category Typinks
 */
export class TypinksController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<TypinksController>(
      TYPINKS_CONTROLLER,
      (c) =>
        new TypinksController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  /**
   * Resolves the controller from the DI container.
   *
   * @param container - The DI container to resolve from.
   * @returns The controller instance.
   */
  static resolve(container: DIContainer): TypinksController {
    return container.resolve(TYPINKS_CONTROLLER)
  }

  /**
   * Creates a new controller instance.
   *
   * @param validator - The validator instance.
   * @param logger - The logger instance.
   * @param templater - The templater instance.
   * @param assets - The assets instance.
   * @param router - The router instance.
   */
  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    assets: HttpServerAssets,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, assets, router)
  }

  /**
   * Registers used middleware in the router.
   */
  use() {
    this.router.addMiddleware('typinks', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('typinks-sse')) {
        message.addRewriteUrlContentTypes(['text/html'])

        message.analyze ||= 'default'

        if (ctx.url.isPath('/api/story')) {
          message.setType('normal-stream-response')
        }
      }

      await next()
    })
  }
}
