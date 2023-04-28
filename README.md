# sanity-plugin-copy-paste

> This is a **Sanity Studio v3** plugin.

With this plugin, you can finally copy/paste referenced blocks in `array` type of fields in Sanity Studio.

![](https://github.com/superside-oss/sanity-copy-paste/raw/main/preview.gif)

## Installation

```sh
npm install sanity-plugin-copy-paste
```

or

```sh
yarn add sanity-plugin-copy-paste
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {copyPastePlugin} from 'sanity-plugin-copy-paste'

export default defineConfig({
  //...
  plugins: [copyPastePlugin()],
})
```

And then insert in any object you want as a field:

```ts
import {copyPaste} from 'sanity-plugin-copy-paste'

export default defineType({
  // ...
  fields: [
    defineField(copyPaste),
    // ...
  ],
})
```

## License

[MIT](LICENSE) © Superside

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit) with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio) on how to run this plugin with hot-reload in the studio.
