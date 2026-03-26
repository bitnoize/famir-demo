import { bootstrapCli } from '@famir/console'
import { makeAssets } from '../assets.js'
import { composer } from '../main.js'

bootstrapCli(composer, makeAssets()).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
