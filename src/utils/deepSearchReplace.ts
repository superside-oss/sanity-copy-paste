import {nanoIdSanity} from './nanoID'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deepSearchReplace = (target: any) => {
  try {
    if (typeof target === 'object') {
      for (const key in target) {
        if (typeof target[key] === 'object') {
          deepSearchReplace(target[key])
        } else if (key === '_key') {
          target[key] = nanoIdSanity()
        }
      }
    } else {
      console.error('undefined type: ', typeof target)
    }
  } catch (error) {
    console.error(error)
  }

  return target
}

export default deepSearchReplace
