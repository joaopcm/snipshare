async function existsInNPM(dep: string): Promise<boolean> {
  const response = await fetch(`https://registry.npmjs.org/${dep}`)
  return response.status === 200
}

/**
 * TODO: It'd be great to allow users to leave a comment right after the import
 * statement including the dependency version.
 *
 * E.g. import { foo } from 'foo'; // 1.2.2
 *
 * The this function would try to install the exact version of the dependency,
 * if it exists in the npm registry.
 */

export async function extractDependencies(jsCode: string): Promise<string[]> {
  const importStatements =
    jsCode.match(/import\s.*?(?:from\s)?['"](.*?)['"]/g) || []
  const requireStatements = jsCode.match(/require\s*\(['"](.*?)['"]\)/g) || []
  const globalImportStatements = jsCode.match(/import\s['"](.*?)['"]/g) || []

  const allStatements = [
    ...importStatements,
    ...requireStatements,
    ...globalImportStatements,
  ]

  const dependencies = new Map()

  // Check all dependencies if each exists in npm registry
  for (const statement of allStatements) {
    const matches = statement.match(/['"](.*?)['"]/)

    if (matches && matches[1]) {
      const dep = matches[1]

      if (dep.includes('/') && (await existsInNPM(dep.split('/')[0]))) {
        dependencies.set(dep.split('/')[0], true)
      } else if (await existsInNPM(dep)) {
        dependencies.set(dep, true)
      }
    }
  }

  return Array.from(dependencies.keys())
}
