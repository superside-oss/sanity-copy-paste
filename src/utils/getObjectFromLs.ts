import ls from './localStorage'

export const getObjectFromLs = (blockType: string): object | string | null => {
  const obj = JSON.parse(ls(`copyObject_${blockType}`) as string)

  if (!obj || obj === 'null' || obj === 'undefined') {
    return null
  }

  return obj
}
