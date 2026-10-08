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
import { HttpbinCustom, HttpbinSettings, HttpbinSpec } from './httpbin.js'
import { httpbinSpecSchema } from './httpbin.schemas.js'

export const HTTPBIN_CONTROLLER = Symbol('HttpbinController')

export class HttpbinController extends BaseController {
  static register(container: DIContainer, settings?: Partial<HttpbinSettings>) {
    container.registerSingleton<HttpbinController>(
      HTTPBIN_CONTROLLER,
      (c) =>
        new HttpbinController(
          c.resolve<Validator>(VALIDATOR),
          c.resolve<Logger>(LOGGER),
          c.resolve<Templater>(TEMPLATER),
          c.resolve<HttpServerAssets>(HTTP_SERVER_ASSETS),
          c.resolve<HttpServerRouter>(HTTP_SERVER_ROUTER),
          settings
        )
    )
  }

  static resolve(container: DIContainer): HttpbinController {
    return container.resolve(HTTPBIN_CONTROLLER)
  }

  protected readonly custom: HttpbinCustom

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    assets: HttpServerAssets,
    router: HttpServerRouter,
    settings: Partial<HttpbinSettings> = {}
  ) {
    super(validator, logger, templater, assets, router)

    this.validator.addSchema('reverse-httpbin-spec', httpbinSpecSchema)

    this.custom = settings.custom ?? {}
  }

  pre() {
    this.router.addMiddleware('httpbin-pre', async (ctx, next) => {
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
    httpbin: async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (ctx.url.isPath(this.streamRequestPaths)) {
        message.setType('normal-stream-request')
      } else if (ctx.url.isPath(this.streamResponsePaths)) {
        message.setType('normal-stream-response')
      }

      if (ctx.url.isPath(this.interestPaths)) {
        target.appendFlag('analyze')
      }

      target.appendFlag('no-cloaking-site')

      await next()
    },
  }

  act() {
    this.router.addMiddleware('httpbin-act', async (ctx, next) => {
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
    httpbin: async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      message
        .addRewriteUrlContentTypes(['text/html'])
        .addContentTypes('html', ['text/html'])
        .addContentTypes('json', ['application/json'])
        .addResponseBodyInterceptor('httpbin', () => {
          if (message.method.is('GET')) {
            if (message.url.isPath('/')) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              if (!message.isResponseContentType('html')) {
                throw new Error(`Unexpected response content-type`)
              }

              message.decorateResponseBodyHtml(($) => {
                if (this.custom.github) {
                  $('a.github-corner').attr('href', this.custom.github)
                }
              })
            } else if (message.url.isPath('/spec.json')) {
              if (!message.status.isSuccess()) {
                throw new Error(`Unexpected response status`)
              }

              if (!message.isResponseContentType('json')) {
                throw new Error(`Unexpected response content-type`)
              }

              message.decorateResponseBodyJson((json) => {
                if (this.checkHttpbinSpec(json)) {
                  json.host = target.mirrorHost

                  if (this.custom.title) {
                    json.info.title = this.custom.title
                  }
                }
              })
            }
          }
        })

      await next()
    },
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
    //'/robots.txt',
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
