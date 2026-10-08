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

export const IMPERSONATE_CONTROLLER = Symbol('ImpersonateController')

export class ImpersonateController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<ImpersonateController>(
      IMPERSONATE_CONTROLLER,
      (c) =>
        new ImpersonateController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): ImpersonateController {
    return container.resolve(IMPERSONATE_CONTROLLER)
  }

  pre() {
    this.router.addMiddleware('impersonate-pre', async (ctx, next) => {
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
    'impersonate-fp': async (ctx, next) => {
      await next()
    },
  }

  act() {
    this.router.addMiddleware('impersonate-act', async (ctx, next) => {
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
    'impersonate-fp': async (ctx, next) => {
      const message = this.getState(ctx, 'message')

      message.addRewriteUrlContentTypes(['text/html'])

      await next()
    },
  }
}
