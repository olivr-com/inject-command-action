# Inject command action

[![tests](https://github.com/olivr-com/inject-command-action/workflows/tests/badge.svg)](https://github.com/olivr-com/inject-command-action/actions?query=workflow%3Atests)

GitHub action to inject the output of a command into a file of your repo.

We use this action to generate certain parts of our README with some third-party CLI tools.

## Usage

### Simple example

It will look for **two occurences** of `<!-- auto-pwd -->` in the file `README.md` and inject the output of `pwd | sed 's/\// /g'` between these two occurences. If this action can't find these occurences, it will inject the output at the end of the `README.md` file.

```yaml
uses: olivr-com/inject-command-action@v1
with:
  command: pwd | sed 's/\// /g'
  target: README.md
```

> `<!-- auto-pwd -->` is used because the first command is **pwd**

### Complete example

It will look for **two occurences** of `<!-- generate-path-section -->` in the file `README.md` and inject the output of `pwd | sed 's/\// /g'` between these two occurences. If this action can't find them, it will **not** inject anything.

```yaml
uses: olivr-com/inject-command-action@v1
with:
  command: pwd | sed 's/\// /g'
  target: README.md
  pattern: <!-- generate-path-section -->
  force: false
```

## Contribute

Checkout the v1 branch

Install the dependencies

```bash
npm install
```

Run the tests

```bash
npm test
```

### Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```
