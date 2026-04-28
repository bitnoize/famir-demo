import { readdir, readFile, stat, writeFile } from 'fs/promises'
import { join } from 'path'

async function generateAssets(sourceDir, targetFile) {
  const sourceFiles = await readdir(sourceDir, { recursive: true })
  const embedFiles = []

  for (const fileName of sourceFiles.sort()) {
    if (fileName === '.gitkeep') {
      continue
    }

    const filePath = join(sourceDir, fileName)
    const fileStat = await stat(filePath)

    if (!fileStat.isFile()) {
      continue
    }

    const fileBody = await readFile(filePath, 'utf8')

    embedFiles.push([fileName, fileBody])
  }

  const targetBody = `// Auto-generated file. Do not edit manually!

export const assets: Map<string, string> = new Map(${JSON.stringify(embedFiles, null, 2)})`

  await writeFile(targetFile, targetBody, 'utf8')
}

try {
  await generateAssets('assets/console', 'src/console/assets.ts')
  await generateAssets('assets/reverse', 'src/reverse/assets.ts')
  await generateAssets('assets/actions', 'src/actions/assets.ts')
} catch (error) {
  console.error(`Generate assets failed`, { error })
}
