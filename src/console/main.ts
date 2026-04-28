import { DIComposer } from '@famir/common'
import {
  CampaignController,
  CampaignService,
  DatabaseController,
  DatabaseService,
  LureController,
  LureService,
  MessageController,
  MessageService,
  PhishmapController,
  PhishmapService,
  ProxyController,
  ProxyService,
  RedirectorController,
  RedirectorService,
  SessionController,
  SessionService,
  TargetController,
  TargetService
} from '@famir/console-app'

export const main: DIComposer = (container) => {
  DatabaseService.register(container)
  DatabaseController.register(container)

  CampaignService.register(container)
  CampaignController.register(container)

  ProxyService.register(container)
  ProxyController.register(container)

  TargetService.register(container)
  TargetController.register(container)

  RedirectorService.register(container)
  RedirectorController.register(container)

  LureService.register(container)
  LureController.register(container)

  SessionService.register(container)
  SessionController.register(container)

  MessageService.register(container)
  MessageController.register(container)

  PhishmapService.register(container)
  PhishmapController.register(container)

  DatabaseController.resolve(container).use()
  CampaignController.resolve(container).use()
  ProxyController.resolve(container).use()
  TargetController.resolve(container).use()
  RedirectorController.resolve(container).use()
  LureController.resolve(container).use()
  SessionController.resolve(container).use()
  MessageController.resolve(container).use()
  PhishmapController.resolve(container).use()
}
