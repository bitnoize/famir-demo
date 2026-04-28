import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { cheerioLoad } from '@famir/http-tools'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'
import { HTTPBIN_CONTROLLER, HttpbinSpec } from './httpbin.js'
import { httpbinSchemas } from './httpbin.schemas.js'

export class HttpbinController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<HttpbinController>(
      HTTPBIN_CONTROLLER,
      (c) =>
        new HttpbinController(
          c.resolve(VALIDATOR),
          c.resolve(LOGGER),
          c.resolve(TEMPLATER),
          c.resolve(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): HttpbinController {
    return container.resolve(HTTPBIN_CONTROLLER)
  }

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, router)

    this.validator.addSchemas(httpbinSchemas)

    this.logger.debug(`HttpbinController initialized`)
  }

  use() {
    this.router.addMiddleware('httpbin', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('httpbin')) {
        message.addRewriteUrlContentTypes(['text/html'])

        message.addContentTypes('html', ['text/html'])
        message.addContentTypes('json', ['application/json'])

        const streamResponsePaths: RegExp[] = [
          /^\/delay\//,
          /^\/drip$/,
          /^\/range\//,
          /^\/stream-bytes\//,
          /^\/stream\//
        ]

        if (streamResponsePaths.some((path) => ctx.url.isPath(path))) {
          message.setType('normal-stream-response')
        }

        const notInterestPaths: RegExp[] = [
          /^\/$/,
          /^\/flasgger_static\//,
          /^\/static\//,
          /^\/spec.json$/
        ]

        if (!notInterestPaths.some((path) => ctx.url.isPath(path))) {
          message.analyze ??= 'default'
        }

        message.addResponseBodyInterceptor('fancy-look', () => {
          const contentType = message.responseHeaders.getContentType()
          if (contentType) {
            if (message.isContentType('html', contentType)) {
              const charset = contentType.parameters['charset']

              const text = message.responseBody.getText(charset)
              const $ = cheerioLoad(text)

              if (message.url.isPath('/') && message.status.isSuccess()) {
                // ...
              }

              message.responseBody.setText($.html())
            } else if (message.isContentType('json', contentType)) {
              const charset = contentType.parameters['charset']

              const json = message.responseBody.getJson(charset)

              if (message.url.isPath('/spec.json') && message.status.isSuccess()) {
                if (this.checkHttpbinSpec(json)) {
                  json.host = target.mirrorHost
                  json.info.title = `Fake Httpbin!`
                }
              }

              message.responseBody.setJson(json)
            }
          }
        })
      }

      await next()
    })
  }

  private checkHttpbinSpec(value: unknown): value is HttpbinSpec {
    return this.validator.guardSchema<HttpbinSpec>('reverse-httpbin-spec', value)
  }
}
