import { DIContainer } from '@famir/common'
import { Logger, LOGGER, TEMPLATER, Templater, Validator, VALIDATOR } from '@famir/domain'
import {
  HTTP_SERVER_ASSETS,
  HTTP_SERVER_ROUTER,
  type HttpServerAssets,
  type HttpServerRouter,
} from '@famir/http-server'
import { BaseController } from '@famir/reverse-app'
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

        if (this.streamRequestPaths.some((path) => ctx.url.isPath(path))) {
          message.setType('normal-stream-request')
        }

        if (this.streamResponsePaths.some((path) => ctx.url.isPath(path))) {
          message.setType('normal-stream-response')
        }

        if (this.interestPaths.some((path) => ctx.url.isPath(path))) {
          message.analyze ||= 'default'
        }

        message.addResponseBodyInterceptor('httpbin-fancy-look', () => {
          if (
            message.method.is('GET') &&
            message.url.isPath('/') &&
            message.isResponseContentType('html') &&
            message.status.isSuccess()
          ) {
            message.decorateResponseBodyHtml(($) => {
              $('a.github-corner').attr('href', 'https://github.com/bitnoize/famir-demo')
            })
          } else if (
            message.method.is('GET') &&
            message.url.isPath('/spec.json') &&
            message.isResponseContentType('json') &&
            message.status.isSuccess()
          ) {
            message.decorateResponseBodyJson((json) => {
              if (this.checkHttpbinSpec(json)) {
                json.host = target.mirrorHost
                json.info.title = `Fake Httpbin`
              }
            })
          }
        })
      }

      await next()
    })
  }

  private streamRequestPaths: (string | RegExp)[] = []

  private streamResponsePaths: (string | RegExp)[] = [
    /^\/delay\//,
    /^\/drip$/,
    /^\/range\//,
    /^\/stream-bytes\//,
    /^\/stream\//,
  ]

  private interestPaths: (string | RegExp)[] = [
    /^\/absolute-redirect\//,
    '/anything',
    /^\/anything\//,
    /^\/base64\//,
    /^\/basic-auth\//,
    '/bearer',
    '/brotli',
    /^\/bytes\//,
    '/cache',
    /^\/cache\//,
    '/cookies',
    '/cookies/delete',
    '/cookies/set',
    /^\/cookies\/set\//,
    '/deflate',
    /^\/delay\//,
    '/delete',
    '/deny',
    /^\/digest-auth\//,
    '/drip',
    '/encoding/utf8',
    /^\/etag\//,
    '/get',
    '/gzip',
    '/headers',
    /^\/hidden-basic-auth\//,
    '/html',
    '/image',
    '/image/jpeg',
    '/image/png',
    '/image/svg',
    '/image/webp',
    '/ip',
    '/json',
    /^\/links\//,
    '/patch',
    '/post',
    '/put',
    /^\/range\//,
    '/redirect-to',
    /^\/redirect\//,
    /^\/relative-redirect\//,
    /^\/response-headers\//,
    '/robots.txt',
    /^\/status\//,
    /^\/stream-bytes\//,
    /^\/stream\//,
    '/user-agent',
    '/uuid',
    '/xml',
  ]

  private checkHttpbinSpec(value: unknown): value is HttpbinSpec {
    return this.validator.guardSchema<HttpbinSpec>('reverse-httpbin-spec', value)
  }
}
