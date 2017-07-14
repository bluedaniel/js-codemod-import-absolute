# JS Codemod Import Absolute

Codemod to replace `["parent", "sibling", "index"]` imports with absolute or custom paths.

It can also sort according to the `eslint-plugin-import` [order rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md).

```javascript
// /Users/bluedaniel/Sites/test/index.js
import bar from './bar';
import _ from 'lodash';
import baz from './bar/baz';
import chalk from 'chalk';
import foo from '../foo';
import foo from 'src/foo';
import fs from 'fs';
import main from './';
import path from 'path';
import qux from '../../foo/qux';

// jscodeshift -t import-absolute.js <file>
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import foo from 'src/foo';
import qux from "/Users/daniellevitt/foo/qux";
import foo from "/Users/daniellevitt/Sites/foo";
import bar from "/Users/daniellevitt/Sites/test/bar";
import baz from "/Users/daniellevitt/Sites/test/bar/baz";
import main from "/Users/daniellevitt/Sites/test";
```

## Installing

```shell
$ git clone https://github.com/bluedaniel/js-codemod-import-absolute.git
$ cd js-codemod-import-absolute
$ npm i
```

## Options

```
--replace
Replace a string in the new path

--replaceWith [default '']
Replaces any occurances of the string specified in `--replace`. Default is ''

--sort [default true]
Sorts imports according to `eslint-plugin-import` order rule
https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
```
