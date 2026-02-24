import { bootstrapStd } from '@famir/analyze-log'
import { composer } from '../composer.js'

bootstrapStd(composer).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
