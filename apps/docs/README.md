# Snipshare Docs

This documentation is built using [Mintlify](https://mintlify.com/). Mintlify is a documentation generator that uses Markdown and React components to create beautiful and interactive documentation.

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at `apps/docs` (where `mint.json` is)

```
mintlify dev
```

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
