import { DIContainer } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  HttpServerMiddleware,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'

export const BROWSERLEAKS_CONTROLLER = Symbol('BrowserleaksController')

export class BrowserleaksController extends BaseController {
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

  static resolve(container: DIContainer): BrowserleaksController {
    return container.resolve(BROWSERLEAKS_CONTROLLER)
  }

  pre() {
    this.router.addMiddleware('browserleaks-pre', async (ctx, next) => {
      const target = this.getState(ctx, 'target')

      const handler = this.dispatchPre[target.label]

      if (handler) {
        await handler(ctx, next)
      } else {
        await next()
      }
    })
  }

  private dispatchPre: Record<string, HttpServerMiddleware> = {
    browserleaks: async (ctx, next) => {
      await next()
    },
  }

  act() {
    this.router.addMiddleware('browserleaks-act', async (ctx, next) => {
      const target = this.getState(ctx, 'target')

      const handler = this.dispatchAct[target.label]

      if (handler) {
        await handler(ctx, next)
      } else {
        await next()
      }
    })
  }

  private dispatchAct: Record<string, HttpServerMiddleware> = {
    browserleaks: async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      message
        .addRewriteUrlContentTypes(['text/html', 'text/css', 'application/javascript'])
        .addContentTypes('html', ['text/html'])
        .addContentTypes('javascript', ['application/javascript'])
        .addResponseBodyInterceptor('browserleaks', () => {
          if (message.method.is('GET')) {
            if (message.url.isPath('/')) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              if (!message.isResponseContentType('html')) {
                throw new Error(`Unexpected response content-type`)
              }

              message.decorateResponseBodyHtml(($) => {
                $('link[rel=icon]').remove()
                $('link[rel=apple-touch-icon]').remove()
              })
            } else if (message.url.isPath('/js/tls.js')) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              if (!message.isResponseContentType('javascript')) {
                throw new Error(`Unexpected response content-type`)
              }

              message.decorateResponseBodyText((text) => {
                return text.replaceAll(
                  `"${target.donorProtocol}//tls1"+e+".${target.donorDomain}"`,
                  `"${target.mirrorProtocol}//tls1"+e+".${target.mirrorDomain}:${target.mirrorPort.toString()}"`
                )
              })
            }
          }
        })

      await next()
    },
  }
}
