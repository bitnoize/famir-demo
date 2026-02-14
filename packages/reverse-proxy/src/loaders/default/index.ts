import { bootstrapDefault } from '@famir/reverse-proxy'
import { composer } from '../../composer.js'

try {
  await bootstrapDefault(composer)
} catch (error) {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
}
