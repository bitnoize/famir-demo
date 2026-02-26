import { bootstrapNet } from '@famir/console'
import { composer } from '../main.js'

bootstrapNet(composer).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
