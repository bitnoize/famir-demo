import { bootstrapStd } from '@famir/analyze'
import { makeAssets } from '../assets.js'
import { composer, specs } from '../main.js'

bootstrapStd(composer, specs, makeAssets()).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
