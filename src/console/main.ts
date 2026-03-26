import { DIComposer } from '@famir/common'
import {
  CampaignController,
  DatabaseController,
  LureController,
  MessageController,
  PhishmapController,
  ProxyController,
  RedirectorController,
  SessionController,
  TargetController
} from '@famir/console'

export const composer: DIComposer = (container) => {
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
