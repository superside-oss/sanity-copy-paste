import {definePlugin} from 'sanity'
import {CopyPasteInput} from './components'
import {CopyPastePluginType, CopyPasteType} from './types'

export const copyPastePlugin = definePlugin<CopyPastePluginType | void>(() => {
  return {
    name: 'sanity-copy-paste',
  }
})

export const copyPaste: CopyPasteType = {
  name: 'copypaste',
  title: 'Copy/paste the item',
  type: 'string',
  components: {
    input: CopyPasteInput,
  },
}
