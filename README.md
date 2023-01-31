## Storybook of MUI (Material-UI v5) based react components

- MUI (react)
- TypeScript
- react-hook-form
- i18nNext for localization
- eslint
- prettier (default settings)
- eslint for react-hooks
- pre-commit hook for linting
- vite build

#### Prerequistes

- node 14, 16
- npm 7, 8
- git client

#### Install

Note (2021-10-17)
Vulnarabilities shown after install are based on dependencies of storybook.
One opinion about this: https://overreacted.io/npm-audit-broken-by-design/

```
git clone git@github.com:pubcore/vite-storybook-mui.git && \
cd ./vite-storybook-mui && \
npm i && \
npm run storybook
```

#### Install as starting point for new project

Find a name for «your-project» in "Kebab case" (this-is-kebab-case). A directory
with this name will be created. Change into your scope/group directory and
execute commands below.
(npm version >= 7 is required to auto install peer dependencies)

```
# If `npx degit` does not work, just clone this repo and delete .git dir
npx degit pubcore/vite-storybook-mui «your-project»
cd «your-project»
git init && \
npm i && \
git add . && git commit -m "init" && \
npm run storybook
```

#### Build package bundle of components

```
npm run build
```

#### Watch: auto build, if code changes

```
npm run watch
```
