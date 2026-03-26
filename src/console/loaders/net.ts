import { bootstrapNet } from '@famir/console'
import { makeAssets } from '../assets.js'
import { composer } from '../main.js'

bootstrapNet(composer, makeAssets()).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
