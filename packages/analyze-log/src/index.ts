import { bootstrapDefault } from '@famir/analyze-log'
import { DIContainer } from '@famir/common'

try {
  await bootstrapDefault((container: DIContainer) => {
    //composeDummy(container)
  })
} catch (error) {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
}
