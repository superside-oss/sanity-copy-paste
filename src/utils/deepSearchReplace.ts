import {nanoIdSanity} from './nanoID'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deepSearchReplace = (target: any) => {
  if (typeof target === 'object') {
    for (const key in target) {
      if (typeof target[key] === 'object') {
        deepSearchReplace(target[key])
      } else if (key === '_key') {
        target[key] = nanoIdSanity()
      }
    }
  }

  return target
}

export default deepSearchReplace
