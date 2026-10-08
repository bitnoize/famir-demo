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

export const TYPINKS_CONTROLLER = Symbol('TypinksController')

export class TypinksController extends BaseController {
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

  static resolve(container: DIContainer): TypinksController {
    return container.resolve(TYPINKS_CONTROLLER)
  }

  pre() {
    this.router.addMiddleware('typinks-pre', async (ctx, next) => {
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
    'typinks-sse': async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (ctx.method.is('GET')) {
        if (ctx.url.isPath('/api/story')) {
          message.setType('normal-stream-response')
        }
      }

      target.appendFlag('no-cloaking-site')

      await next()
    },
  }

  act() {
    this.router.addMiddleware('typinks-act', async (ctx, next) => {
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
    'typinks-sse': async (ctx, next) => {
      const message = this.getState(ctx, 'message')

      message.addRewriteUrlContentTypes(['text/html'])

      await next()
    },
  }
}
