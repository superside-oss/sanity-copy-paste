# sanity-plugin-copy-paste

> This is a **Sanity Studio v3** plugin.

## Installation

```sh
npm install sanity-plugin-copy-paste
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {copyPastePlugin} from 'sanity-plugin-copy-paste'

export default defineConfig({
  //...
  plugins: [copyPastePlugin({})],
})
```

## License

[MIT](LICENSE) © Superside

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.
