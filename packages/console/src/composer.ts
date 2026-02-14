import { DIComposer } from '@famir/common'
import {
  composeCampaignModule,
  composeDatabaseModule,
  composeLureModule,
  composeMessageModule,
  composeProxyModule,
  composeRedirectorModule,
  composeSessionModule,
  composeTargetModule
} from '@famir/console'

export const composer: DIComposer = (container) => {
  const database = composeDatabaseModule(container)
  const campaign = composeCampaignModule(container)
  const proxy = composeProxyModule(container)
  const target = composeTargetModule(container)
  const redirector = composeRedirectorModule(container)
  const lure = composeLureModule(container)
  const session = composeSessionModule(container)
  const message = composeMessageModule(container)

  database.use()
  campaign.use()
  proxy.use()
  target.use()
  redirector.use()
  lure.use()
  session.use()
  message.use()
}
