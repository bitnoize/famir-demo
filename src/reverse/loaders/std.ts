import { bootstrapStd } from '@famir/reverse'
import { makeAssets } from '../assets.js'
import { composer } from '../main.js'

bootstrapStd(composer, makeAssets()).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
