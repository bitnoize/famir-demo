// Auto-generated file. Do not edit manually!

// prettier-ignore
const ASSETS: string[] = [

]

export function makeAssets(): [string, string][] {
  const entries: [string, string][] = []

  for (let idx = 0; idx < ASSETS.length; idx += 2) {
    const name = ASSETS[idx]
    const body = ASSETS[idx + 1]

    if (name && body) {
      const data = Buffer.from(body, 'base64').toString()
      entries.push([name, data])
    }
  }

  return entries
}
