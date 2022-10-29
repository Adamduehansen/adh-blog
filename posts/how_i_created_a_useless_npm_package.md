---
title: How I Published a Useless Node Module To NPM
publish_date: 2022-10-29
---

This year I made it a new year's resolution to create and publish my own node module to NPM. It didn't have to be anything groundbreaking or revolutionary. The goal of this project was to **learn how to create and publish a module to NPM**, and hopefully learn some new JavaScript aswell along the way. I wanted the project to be supported by these features:
- TypeScript
- Testing with Jest
- CommonJS and ES modules so that older versions of Node is supported.

The result is my very own first package: [createSelector](https://www.npmjs.com/package/@adamduehansen/create-selector)! I don't think there are any real-world scenarios where I would use it myself - but it was a fun project to code.

Below are instructions on how to setup and publish a node module.

# Login to NPM

An account at NPM is obviously needed. If you don't already have one, go create one at https://www.npmjs.com/signup.

Next login by running this command in a terminal/command prompt: `npm login`. Follow the instructions and you should be good to go.

# Create a new project

Go to Github and create a repository for the project:
- Set project to public - I dont know if it is required but I think it's nice to let other developers browse your code.
- Tick the "Add a README file" option.
- Add a .gitignore template for Node.

Hit the "Create repository" button.

Open a new terminal, command prompt or GUI to pull the created repository to your machine.

```bash
git clone https://github.com/<username>/<project>.git
```

Step into to the folder and initialize a new NPM project.

```bash
cd ./<name-of-project>

# Standard
npm init

# Or with a scroped name
npm init --scope@<username|organization>
```

You should end up with something similar to
```json
{
  "name": "@adamduehansen/<name-of-project>",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Adamduehansen/<name-of-project>.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/Adamduehansen/<name-of-project>/issues"
  },
  "homepage": "https://github.com/Adamduehansen/<name-of-project>#readme"
}

```

# Prepare project configuration

Lets first add our dependencies for TypeScript and testing:

```
npm install --save-dev typescript jest @types/jest ts-jest
```

## TypeScript

We want to create two TypeScript configuration files. One for ES modules and one for CommonJS.

Create a TypeScript configuration file:

```
npx tsc --init
```

This will be the configuration used for ES modules: 
- Set `target` to "es2020".
- Set `module` to "ES2020".
- Set `declaration` to true.
- Set `outDir` to "./dist/esm".

Add an include section to include our code. But also add an exclude section so that test files are not compiled.

```json
{
  // ...
  "include": [
    "./src"
  ],
  "exclude": [
    "./src/*.test.ts"
  ]
}
```

Create another TypeScript configuration file called "tsconfig-cjs.json" and add the following content:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "./dist/cjs"
  }
}
```

This is the configuration for CommonJS. It extends the first TypeScript configuration but overrides a few properties so that the compiled files are separated.

Open the package.json file. We are going to change and add a few things here aswell:

```JSON
{
  // ...
  "main": "./dist/cjs/index.js", // Sets the CommonJS exported file.
  "module": "./dist/esm/index.js", // Sets the ES modules exported file.
  "files": [ // Sets which files are included in the package.
    "dist/"
  ],
  // ...
  "scripts": {
    // ... other scripts
    // Compile our files with TypeScript.
    "tsc": "tsc -p tsconfig.json && tsc -p tsconfig-cjs.json",
  },
}
```

Running `npm run tsc` should now build our files (though this will currently fail since there are no files to compile).

## Tests

Create a Jest config file:

```
npx ts-jest config:init
```

Update the package.json file with a test script.

```JSON
{
  // ...
  "scripts": {
    // ... other scripts
    "test": "jest"
  },
}
```

Running `npm test` should now run tests with Jest.

# Write the source files

Make a folder called "src" - this is where we put all of our code. Lets make something easy: a function that adds two numbers. Add a "math.ts" file to the src folder and insert this code:

```javascript
export function add (a: number, b: number): number {
  return a + b;
}
```

Lets test this in "math.test.ts":

```javascript
import { add } from "./math";

describe("math", () => {
  describe("add", () => {
    test('should return a and b added together', () => {
      // Arrange
      const expected = 4;

      // Act
      const actual = add(2, 2);
      
      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
```

Add a new file to the src folder called "index.ts". This file will simply just import and export our code.

```javascript
import { add } from "./math";

export default {
  add
}
```

# Setup the project for publishing

Add a prepublish script to package.json

```json
{
  // ..
  "scripts": {
    // ... other scripts
    "prepublish": "npm run tsc"
  },
}
```

Unless you want to money in the direction of NPM, we need to set the access to public.

```json
{
  // ..
  "publishConfig": {
    "access": "public"
  },
}
```

You could publish the package now, **but review the next section to learn how to test the package locally!**

## Test the package locally

At this point you can run `npm pack` which will create a .zip of the content to be published.

You can also use `sudo npm link` to tell NPM to cache this package to your machine. Then create a test folder somewhere on your disk. Initialize a quick npm project with `npm init -y` from that folder. Run `npm link <name-of-project>` **(remember to include to scoped name in the project name)** to install our package.

Create a "script.js" file and add the content:

```javascript
const math = require('<name-of-project>').default;

// Try to type this out. IntelliSense should help you here with the typings of "math".
const result = math.add(2, 2);

console.log(result);
```

and run `node script.js`. This should print `4` to the console.

To test with TypeScript add a "script.ts" file. Add the content:

```javascript
import math from '<name-of-project>';

// Try to type this out. IntelliSense should help you here with the typings of "math".
const result = math.add(2, 2);

console.log(result);

```

install ts-node `npm install --save-dev ts-node`, and run `npx ts-node script.ts`. This should print `4` to the console aswell.

If satisfied, you can now publish your project with `npm publish`. Hopefully you should be able to view your package page on NPM via https://www.npmjs.com/settings/npm-username/packages
