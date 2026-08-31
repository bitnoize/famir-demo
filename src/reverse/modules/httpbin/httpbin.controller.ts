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
import { HttpbinSpec } from './httpbin.js'
import { httpbinSpecSchema } from './httpbin.schemas.js'

/**
 * DI token for the httpbin controller.
 *
 * @category Httpbin
 */
export const HTTPBIN_CONTROLLER = Symbol('HttpbinController')

/**
 * Represents the httpbin controller.
 *
 * @category Httpbin
 */
export class HttpbinController extends BaseController {
  /**
   * Registers the controller as a singleton in the DI container.
   *
   * @param container - The DI container to register in.
   */
  static register(container: DIContainer) {
    container.registerSingleton<HttpbinController>(
      HTTPBIN_CONTROLLER,
      (c) =>
        new HttpbinController(
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
  static resolve(container: DIContainer): HttpbinController {
    return container.resolve(HTTPBIN_CONTROLLER)
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

    this.validator.addSchema('reverse-httpbin-spec', httpbinSpecSchema)
  }

  /**
   * Registers used middleware in the router.
   */
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
          /^\/stream\//,
        ]

        if (streamResponsePaths.some((path) => ctx.url.isPath(path))) {
          message.setType('normal-stream-response')
        }

        const notInterestPaths: RegExp[] = [
          /^\/$/,
          /^\/flasgger_static\//,
          /^\/static\//,
          /^\/spec.json$/,
        ]

        if (!notInterestPaths.some((path) => ctx.url.isPath(path))) {
          message.analyze ||= 'default'
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
