# tanulo-next

![Build status](https://github.com/kir-dev/tanulo-next/workflows/Node%20CI/badge.svg)
[![codebeat badge](https://codebeat.co/badges/f1ae2298-371c-4e4a-a712-64b13223b79c)](https://codebeat.co/projects/github-com-kir-dev-tanulo-next-master)

## Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [Postgresql](https://www.postgresql.org/download/)
- Install [VS Code](https://code.visualstudio.com/)

or

- Docker

## Getting started bare-metal

- Clone the repository

```bash
git clone https://github.com/kir-dev/tanulo-next.git <project_name>
```

- Install dependencies

```bash
cd <project_name>
yarn install
```

- Configure your postgresql server

```bash
sudo su postgres
psql -c 'create user "tanulo" with superuser password '\''tanulo'\'';'
psql -c 'create database "tanulo";'
```

- Set up a `.env` file based on `.env.example` with real values.

- Run migrations

```bash
yarn run migrate
```

- *Optional*: Set up seed in database

```bash
yarn run seed
```

- Build and run the project

```bash
yarn run build
yarn start
```

Finally, navigate to `http://localhost:3000` and you should see the site being served and rendered locally!

Run `yarn watch` to run reload the server on file changes. Note: this deletes the session, so you'll have to login again.

## Setting up with Docker

- Set up a `.env` file based on `.env.example` with real values.

```bash
docker-compose build
docker-compose up
```

While the containers are running, execute the following:

```bash
docker-compose run tanulo bash -c "yarn run migrate"
```

## Debugging

Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps

Source maps allow you to drop break points in your TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime.

> **Note!** - Source maps aren't specific to TypeScript.
> Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps

First you need to make sure your `tsconfig.json` has source map generation enabled:

```json
"compilerOptions" {
    "sourceMap": true
}
```

With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
> This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
> Because we are writing Node.js code, we don't have to worry about this.

### Using the debugger in VS Code

Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to setup and even easier to use.
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.
In this file, you can tell VS Code exactly what you want to do:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach by Process ID",
  "processId": "${command:PickProcess}",
  "protocol": "inspector"
}
```

This is mostly identical to the "Node.js: Attach by Process ID" template with one minor change.
We added `"protocol": "inspector"` which tells VS Code that we're using the latest version of Node which uses a new debug protocol.

With this file in place, you can hit `F5` to attach a debugger.
You will probably have multiple node processes running, so you need to find the one that shows `node dist/server.js`.
Now just set your breakpoints and go!

## Testing

For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.
While Mocha is probably more common, Mocha seems to be looking for a new maintainer and setting up TypeScript testing in Jest is wicked simple.

### Running tests

Simply run `yarn run test`.
Note this will also generate a coverage report.

## ESLint

ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

### ESLint rules

Like most linters, ESLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `.eslintrc` configuration file.
In this project, we are using a fairly basic set of rules with no additional custom rules.

### Running ESLint

Like the rest of our build steps, we use yarn scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.

```bash
yarn run build   // runs full build including ESLint
yarn run lint    // runs only ESLint
```

Notice that ESLint is not a part of the main watch task.

If you are interested in seeing ESLint feedback as soon as possible, I strongly recommend the [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## License

Copyright (c) Kir-Dev.
Licensed under the [MIT](https://github.com/kir-dev/tanulo-next/blob/master/LICENSE) License.
