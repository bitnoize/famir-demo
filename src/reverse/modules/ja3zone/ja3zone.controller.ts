import { DIContainer } from '@famir/common'
import { HTTP_SERVER_ROUTER, HttpServerRouter } from '@famir/http-server'
import { cheerioLoad } from '@famir/http-tools'
import { Logger, LOGGER } from '@famir/logger'
import { BaseController } from '@famir/reverse-app'
import { TEMPLATER, Templater } from '@famir/templater'
import { Validator, VALIDATOR } from '@famir/validator'
import { JA3ZONE_CONTROLLER } from './ja3zone.js'

export class Ja3zoneController extends BaseController {
  static register(container: DIContainer) {
    container.registerSingleton<Ja3zoneController>(
      JA3ZONE_CONTROLLER,
      (c) =>
        new Ja3zoneController(
          c.resolve(VALIDATOR),
          c.resolve(LOGGER),
          c.resolve(TEMPLATER),
          c.resolve(HTTP_SERVER_ROUTER)
        )
    )
  }

  static resolve(container: DIContainer): Ja3zoneController {
    return container.resolve(JA3ZONE_CONTROLLER)
  }

  constructor(
    validator: Validator,
    logger: Logger,
    templater: Templater,
    router: HttpServerRouter
  ) {
    super(validator, logger, templater, router)

    this.logger.debug(`Ja3zoneController initialized`)
  }

  use() {
    this.router.addMiddleware('ja3zone', async (ctx, next) => {
      const target = this.getState(ctx, 'target')
      const message = this.getState(ctx, 'message')

      if (target.hasLabel('ja3zone')) {
        message.addRewriteUrlContentTypes(['text/html', 'application/javascript'])

        message.addContentTypes('html', ['text/html'])

        message.addResponseBodyInterceptor('ja3zone-fancy-look', () => {
          const contentType = message.responseHeaders.getContentType()
          if (contentType) {
            if (message.isContentType('html', contentType)) {
              const charset = contentType.parameters['charset']

              const text = message.responseBody.getText(charset)
              const $ = cheerioLoad(text)

              if (message.url.isPath('/') && message.status.isSuccess()) {
                // ...
              }

              $('script[src^=https://static.cloudflareinsights.com]').remove()

              message.responseBody.setText($.html())
            }
          }
        })
      }

      await next()
    })
  }
}
