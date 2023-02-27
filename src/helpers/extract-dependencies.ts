export function extractDependencies(jsCode: string) {
  const importStatements =
    jsCode.match(/import\s.*?(?:from\s)?['"](.*?)['"]/g) || []
  const requireStatements = jsCode.match(/require\s*\(['"](.*?)['"]\)/g) || []
  const globalImportStatements = jsCode.match(/import\s['"](.*?)['"]/g) || []
  const allStatements = [
    ...importStatements,
    ...requireStatements,
    ...globalImportStatements,
  ]

  const dependencies = allStatements.map((statement) => {
    const matches = statement.match(/['"](.*?)['"]/)

    if (matches && matches[1]) {
      return matches[1]
    }

    return null
  })

  const validDependencies = dependencies.filter((dep) => dep !== null)

  return [...new Set(validDependencies)]
}
