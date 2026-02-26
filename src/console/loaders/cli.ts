import { bootstrapCli } from '@famir/console'
import { composer } from '../main.js'

bootstrapCli(composer).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
