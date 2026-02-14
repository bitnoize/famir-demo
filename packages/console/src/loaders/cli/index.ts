import { bootstrapCli } from '@famir/console'
import { composer } from '../../composer.js'

try {
  await bootstrapCli(composer)
} catch (error) {
  console.error(`App bootstrap failed`, { error })

  process.exit(1)
}
