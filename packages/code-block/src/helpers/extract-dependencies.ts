async function fetchNPMPackageVersion(
  dep: string,
  version?: string,
): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${dep}`)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch package ${dep}: Status ${response.status}`,
      )
    }
    const data = await response.json()
    if (version) {
      // Check if the specific version exists in the fetched package metadata
      const versions = Object.keys(data.versions)
      if (!versions.includes(version)) {
        console.error(`Version ${version} of package ${dep} is not available.`)
        return null
      }
      return version
    } else {
      // Return the latest version if no specific version is specified
      return data['dist-tags'].latest
    }
  } catch (error) {
    console.error('Error fetching NPM data for:', dep, version, error)
    return null
  }
}

export async function extractDependencies(
  code: string,
): Promise<{ packageName: string; version: string }[]> {
  const importRegex =
    /import\s.*?(?:from\s)?['"]([^'"]*)['"](?:;\s*\/\/\s*(\d+\.\d+\.\d+))?/g
  const requireRegex =
    /require\s*\(['"]([^'"]*)['"]\)(?:;\s*\/\/\s*(\d+\.\d+\.\d+))?/g

  const dependencies = new Map<string, string>()

  const analyzeDependency = async (dep: string, specifiedVersion?: string) => {
    if (!dep) return
    const packageName = dep.split('/')[0] // Get the package name before any slashes
    const version =
      specifiedVersion ||
      (await fetchNPMPackageVersion(packageName, specifiedVersion))
    if (version) {
      dependencies.set(packageName, version)
    }
  }

  let match
  // Check for imports with optional version comments
  while ((match = importRegex.exec(code)) !== null) {
    const [, dep, versionComment] = match
    await analyzeDependency(dep, versionComment)
  }

  // Check for requires with optional version comments
  while ((match = requireRegex.exec(code)) !== null) {
    const [, dep, versionComment] = match
    await analyzeDependency(dep, versionComment)
  }

  return Array.from(dependencies, ([packageName, version]) => ({
    packageName,
    version,
  }))
}
