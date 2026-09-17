import { DIContainer } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'
import { HackernewsPayloadName } from './hackernews.js'

/**
 * DI token for the hackernews controller.
 *
 * @category Hackernews
 */
export const HACKERNEWS_CONTROLLER = Symbol('HackernewsController')

/**
 * Represents the hackernews controller.
 *
 * @category Hackernews
 */
export class HackernewsController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<HackernewsController>(
      HACKERNEWS_CONTROLLER,
      (c) =>
        new HackernewsController(
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
  static resolve(container: DIContainer): HackernewsController {
    return container.resolve(HACKERNEWS_CONTROLLER)
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
  usePre() {
    this.router.addMiddleware('hackernews-pre', async (ctx, next) => {
      const target = this.getState(ctx, 'target')

      if (target.hasLabel('hackernews')) {
        if (ctx.method.is('GET') && ctx.url.isPath('/logout')) {
          await this.sendMainRedirect(ctx)

          return
        }
      }

      await next()
    })
  }

  /**
   * Registers used middleware in the router.
   */
  use() {
    this.router.addMiddleware('hackernews', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('hackernews')) {
        message.addRewriteUrlContentTypes(['text/html'])

        message.addContentTypes('html', ['text/html'])
        message.addContentTypes('urlEncoded', ['application/x-www-form-urlencoded'])

        message.addRequestBodyInterceptor('hackernews', () => {
          if (message.method.is('POST')) {
            message.analyze ||= 'default'

            if (message.isRequestContentType('urlEncoded')) {
              const bodyParams = message.retrieveRequestBodyQueryString()

              let payloadName: HackernewsPayloadName
              if (message.url.isPath('/login')) {
                payloadName = 'hackernews_login'
              } else if (message.url.isPath('/comment')) {
                payloadName = 'hackernews_comment'
              } else if (message.url.isPath('/xuser')) {
                payloadName = 'hackernews_xuser'
              } else if (message.url.isPath('/xedit')) {
                payloadName = 'hackernews_xedit'
              } else if (message.url.isPath('/xdelete')) {
                payloadName = 'hackernews_xdelete'
              } else if (message.url.isPath('/r')) {
                payloadName = 'hackernews_r'
              } else {
                payloadName = 'hackernews_unknown'
              }

              message.payload[payloadName] = bodyParams
            }
          }
        })

        message.addResponseBodyInterceptor('hackernews', () => {
          if (message.method.is('GET')) {
            if (message.isResponseContentType('html')) {
              message.decorateResponseBodyHtml(($) => {
                $('.hnname > a:nth-child(1)').text('Fake Hacker News')
              })
            }
          } else if (message.method.is('POST')) {
            message.payload['hackernews_okey'] = message.status.isRedirect()
          }
        })
      }

      await next()
    })
  }
}
