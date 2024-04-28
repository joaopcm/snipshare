/* eslint-disable @typescript-eslint/no-explicit-any */

type GenericObject = { [key: string]: any }

export function deepMerge<T extends GenericObject>(target: T, source: T): T {
  const output = Object.assign({}, target) as T

  Object.keys(source).forEach((key) => {
    if (isObject(source[key])) {
      if (!(key in target)) {
        Object.assign(output, { [key]: source[key] })
      } else {
        // @ts-expect-error Generic T ideally should only be used for reading purposes
        output[key] = deepMerge(
          target[key] as GenericObject,
          source[key] as GenericObject,
        )
      }
    } else {
      Object.assign(output, { [key]: source[key] })
    }
  })

  return output
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}
