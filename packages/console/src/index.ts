import { DIContainer } from '@famir/common'
import {
  composeCampaignModule,
  composeProxyModule,
  composeTargetModule,
  composeRedirectorModule,
  composeLureModule,
  composeSessionModule,
  composeMessageModule,
  bootstrap
} from '@famir/console'

try {
  await bootstrap(async (container) => {
    await composeCampaignModule(container)
    await composeProxyModule(container)
    await composeTargetModule(container)
    await composeRedirectorModule(container)
    await composeLureModule(container)
    await composeSessionModule(container)
    await composeMessageModule(container)
  })
} catch (error) {
  console.error(`Bootstrap failed`, { error })

  process.exit(1)
}
