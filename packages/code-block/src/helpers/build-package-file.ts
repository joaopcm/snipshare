import { extractDependencies } from './extract-dependencies'

export async function buildPackageFile(code: string) {
  const dependenciesToInstall = await extractDependencies(code)

  return {
    file: {
      contents: JSON.stringify(
        {
          name: 'snipshare-demo-app',
          scripts: {
            build: 'tsc index.ts',
            start: 'node index.js',
          },
          devDependencies: { typescript: '5.2.2' },
          dependencies: dependenciesToInstall.reduce(
            (acc, dep) => ({ ...acc, [dep.packageName]: dep.version }),
            {},
          ),
        },
        null,
        2,
      ),
    },
  }
}
