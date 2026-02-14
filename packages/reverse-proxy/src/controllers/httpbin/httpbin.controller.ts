import { DIContainer } from '@famir/common'
import { Logger, LOGGER } from '@famir/logger'
import { Validator, VALIDATOR } from '@famir/validator'
import {
  HTTP_SERVER_ROUTER,
  HttpServerMiddleware,
  HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-proxy'
import { rewriteUrl, cheerioLoad } from '@famir/http-tools'

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
    this.router.register('httpbin', this.httpbinMiddleware)
  }

  private httpbinMiddleware: HttpServerMiddleware = async (ctx, next) => {
    const target = this.getState(ctx, 'target')
    const targets = this.getState(ctx, 'targets')
    const message = this.getState(ctx, 'message')

    /*
    if (target.hasLabel('httpbin')) {
      message.addRequestHeadInterceptor('gzip', () => {
        if (message.url.isPathEquals('/gzip')) {
          if (message.method.is('GET')) {
            message.score += 10

            message.payload['httpbin-gzip'] = {
              foo: 'bar'
            }
          }
        }
      })

      message.addRequestBodyInterceptor('some-test', () => {
        const contentType = message.requestHeaders.getContentType()
      })

      message.addResponseBodyInterceptor('some-test', () => {
        if (!message.requestHeaders.has('ContentType')) {
          return
        }

        const contentType = message.responseHeaders.getContentType()

        if (contentType.type === 'text/html') {
          const text = message.responseBody.getText(contentType.parameters['charset'])

          const $ = cheerioLoad(text)

          message.responseBody.setText(rewriteUrlsText, contentType.parameters['charset'])
        }
      })
    }
    */

    await next()
  }
}

          //const rewriteUrlsText = rewriteUrls(text, false, targets, [['://', true]])

