import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { cheerioLoad } from '@famir/http-tools'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'
import { HACKERNEWS_CONTROLLER, HackernewsPayloadName } from './hackernews.js'

export class HackernewsController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<HackernewsController>(
      HACKERNEWS_CONTROLLER,
      (c) =>
        new HackernewsController(
          c.resolve(VALIDATOR),
          c.resolve(LOGGER),
          c.resolve(TEMPLATER),
          c.resolve(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): HackernewsController {
    return container.resolve(HACKERNEWS_CONTROLLER)
  }

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, router)

    this.logger.debug(`HackernewsController initialized`)
  }

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

  use() {
    this.router.addMiddleware('hackernews', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('hackernews')) {
        message.addRewriteUrlContentTypes(['text/html'])

        message.addContentTypes('html', ['text/html'])
        message.addContentTypes('urlEncoded', ['application/x-www-form-urlencoded'])

        message.addRequestBodyInterceptor('hackernews', () => {
          const contentType = message.requestHeaders.getContentType()

          if (message.method.is('POST')) {
            message.analyze ??= 'default'

            if (contentType && message.isContentType('urlEncoded', contentType)) {
              const charset = contentType.parameters['charset']

              const bodyParams = message.requestBody.getQueryString(charset)

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
          const contentType = message.responseHeaders.getContentType()

          if (message.method.is('GET')) {
            if (contentType && message.isContentType('html', contentType)) {
              const charset = contentType.parameters['charset']

              const text = message.responseBody.getText(charset)
              const $ = cheerioLoad(text)

              $('.hnname > a:nth-child(1)').text('Fake Hacker News!')

              message.responseBody.setText($.html())
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
