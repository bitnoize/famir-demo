import { bootstrapStd } from '@famir/analyze'
import { composer, specs } from '../main.js'

bootstrapStd(composer, specs).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
