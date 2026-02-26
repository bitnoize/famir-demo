import { bootstrapStd } from '@famir/reverse'
import { composer } from '../main.js'

bootstrapStd(composer).catch((error: unknown) => {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
})
