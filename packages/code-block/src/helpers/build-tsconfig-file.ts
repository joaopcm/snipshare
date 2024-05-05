export function buildTSConfigFile() {
  return {
    file: {
      contents: JSON.stringify(
        {
          compilerOptions: {
            target: 'es2017',
            module: 'commonjs',
            lib: ['es2017'],
            esModuleInterop: true,
            moduleResolution: 'node',
          },
          include: ['index.ts'],
        },
        null,
        2,
      ),
    },
  }
}
