export const HTTPBIN_CONTROLLER = Symbol('HttpbinController')

export interface HttpbinSpec {
  basePath: string
  host: string
  info: {
    contact: {
      email?: string | null | undefined
      responsibleDeveloper?: string | null | undefined
      responsibleOrganization?: string | null | undefined
      url?: string | null | undefined
    }
    description: string
    title: string
    version: string
  }
  protocol: string
  schemes: string[]
}
