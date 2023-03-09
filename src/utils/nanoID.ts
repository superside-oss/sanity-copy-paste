import {customAlphabet} from 'nanoid'

export const nanoIdSanity = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const nanoid = customAlphabet(alphabet, 32)()

  return nanoid
}
