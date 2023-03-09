export interface CopyPastePluginType {}

export type CopyPasteType = {
  name: string
  title: string
  type: string
  components: {input: any}
}

export interface CopyPasteInputType {
  id: string
}
