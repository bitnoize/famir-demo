import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { cheerioLoad } from '@famir/http-tools'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse'
import { Validator, VALIDATOR } from '@famir/validator'
import { Transform, TransformCallback } from 'stream'

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
        message.analyze = 'dummy'

        message.addRewriteUrlTypes(['text/html'])

        message.addContentTypes('html', ['text/html'])

        message.addResponseBodyInterceptor('fancy-look', () => {
          const contentType = message.responseHeaders.getContentType()

          if (contentType && message.url.isPath('/')) {
            if (message.isContentType(contentType, 'html')) {
              const text = message.responseBody.getText(contentType.parameters['charset'])
              const $ = cheerioLoad(text)

              if (message.status.isSuccess()) {
                $('h2.title').text('AAAAAAAAA')
              }

              message.responseBody.setText($.html())
              message.responseHeaders.set('Content-Length', message.responseBody.length.toString())
            }
          }
        })

        if (ctx.url.isPath('/')) {
          // ...
        } else if (ctx.url.isPath(/^\/delay\//)) {
          message.setKind('stream-response')
        } else if (ctx.url.isPath('/drip')) {
          message.setKind('stream-response')
        } else if (ctx.url.isPath(/^\/range\//)) {
          message.setKind('stream-response')
        } else if (ctx.url.isPath(/^\/stream-bytes\//)) {
          message.setKind('stream-response')
        } else if (ctx.url.isPath(/^\/stream\//)) {
          message.setKind('stream-response')
        }
      }

      await next()
    })
  }
}
