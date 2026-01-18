import { DIContainer } from '@famir/common'
import {
  composeDatabaseModule,
  composeCampaignModule,
  composeProxyModule,
  composeTargetModule,
  composeRedirectorModule,
  composeLureModule,
  composeSessionModule,
  composeMessageModule,
  bootstrapCli
} from '@famir/console'

try {
  await bootstrapCli(async (container) => {
    await composeDatabaseModule(container)
    await composeCampaignModule(container)
    await composeProxyModule(container)
    await composeTargetModule(container)
    await composeRedirectorModule(container)
    await composeLureModule(container)
    await composeSessionModule(container)
    await composeMessageModule(container)
  })
} catch (error) {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
}
