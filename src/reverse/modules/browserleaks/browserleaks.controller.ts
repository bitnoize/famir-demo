import { DIContainer } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'

/**
 * DI token for the browserleaks controller.
 *
 * @category Browserleaks
 */
export const BROWSERLEAKS_CONTROLLER = Symbol('BrowserleaksController')

/**
 * Represents the browserleaks controller.
 *
 * @category Browserleaks
 */
export class BrowserleaksController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<BrowserleaksController>(
      BROWSERLEAKS_CONTROLLER,
      (c) =>
        new BrowserleaksController(
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
  static resolve(container: DIContainer): BrowserleaksController {
    return container.resolve(BROWSERLEAKS_CONTROLLER)
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
    this.router.addMiddleware('browserleaks', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('browserleaks')) {
        message.addRewriteUrlContentTypes(['text/html', 'text/css', 'application/javascript'])

        message.addContentTypes('html', ['text/html'])
        message.addContentTypes('javascript', ['application/javascript'])

        message.addResponseBodyInterceptor('browserleaks-fancy-look', () => {
          if (
            message.method.is('GET') &&
            message.url.isPath('/') &&
            message.isResponseContentType('html') &&
            message.status.isSuccess()
          ) {
            message.decorateResponseBodyHtml(($) => {
              $('link[rel=icon]').remove()
              $('link[rel=apple-touch-icon]').remove()
            })
          } else if (
            message.method.is('GET') &&
            message.url.isPath('/js/tls.js') &&
            message.isResponseContentType('javascript') &&
            message.status.isSuccess()
          ) {
            message.decorateResponseBodyText((text) => {
              return text.replaceAll(
                `"${target.donorProtocol}//tls1"+e+".${target.donorDomain}"`,
                `"${target.mirrorProtocol}//tls1"+e+".${target.mirrorDomain}:${target.mirrorPort.toString()}"`
              )
            })
          }
        })
      }

      await next()
    })
  }
}
