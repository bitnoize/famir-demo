import { DIContainer } from '@famir/common'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerAssets,
  HttpServerRouter,
} from '@famir/http-server'
import { cheerioLoad } from '@famir/http-tools'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'

/**
 * DI token for the ja3zone controller.
 *
 * @category Ja3zone
 */
export const JA3ZONE_CONTROLLER = Symbol('Ja3zoneController')

/**
 * Represents the ja3zone controller.
 *
 * @category Ja3zone
 */
export class Ja3zoneController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<Ja3zoneController>(
      JA3ZONE_CONTROLLER,
      (c) =>
        new Ja3zoneController(
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
  static resolve(container: DIContainer): Ja3zoneController {
    return container.resolve(JA3ZONE_CONTROLLER)
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
    this.router.addMiddleware('ja3zone', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('ja3zone')) {
        message.addRewriteUrlContentTypes(['text/html', 'application/javascript'])

        message.addContentTypes('html', ['text/html'])

        message.addResponseBodyInterceptor('ja3zone-fancy-look', () => {
          const contentType = message.responseHeaders.getContentType()
          if (contentType) {
            if (message.isContentType('html', contentType)) {
              const charset = contentType.parameters['charset']

              const text = message.responseBody.getText(charset)
              const $ = cheerioLoad(text)

              if (message.url.isPath('/') && message.status.isSuccess()) {
                // ...
              }

              $('script[src^=https://static.cloudflareinsights.com]').remove()

              message.responseBody.setText($.html())
            }
          }
        })
      }

      await next()
    })
  }
}
