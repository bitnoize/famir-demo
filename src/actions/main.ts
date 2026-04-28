import { AnalyzeController, AnalyzeService } from '@famir/actions-app'
import { DIComposer } from '@famir/common'

export const main: DIComposer = (container) => {
  AnalyzeService.register(container)
  AnalyzeController.register(container)

  AnalyzeController.resolve(container).use()
}
