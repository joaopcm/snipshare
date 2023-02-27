export function extractDependencies(jsCode: string): string[] {
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

  allStatements.forEach((statement) => {
    const matches = statement.match(/['"](.*?)['"]/)

    if (matches && matches[1]) {
      dependencies.set(matches[1], true)
    }
  })

  return Array.from(dependencies.keys())
}
