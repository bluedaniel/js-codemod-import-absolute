# JS Codemod Import Absolute

Codemod to replace `["parent", "sibling", "index"]` imports with absolute or custom paths.

It can also sort according to the `eslint-plugin-import` [order rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md).

*Note*: Use the -d option for a dry-run and use -p to print the output for comparison.

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
import qux from "/Users/bluedaniel/foo/qux";
import foo from "/Users/bluedaniel/Sites/foo";
import bar from "/Users/bluedaniel/Sites/test/bar";
import baz from "/Users/bluedaniel/Sites/test/bar/baz";
import main from "/Users/bluedaniel/Sites/test";
```

## Installing

```shell
$ git clone https://github.com/bluedaniel/js-codemod-import-absolute.git
$ cd js-codemod-import-absolute
$ npm i
```

## Options (All are optional)

```
--absolutePath
Replaces your current directory to a string of your choosing

--replace
Replace any string in the new path

--replaceWith [default '']
Replaces any occurrences of the string specified in `--replace`. Default is ''

--sort [default true]
Sorts imports according to `eslint-plugin-import` order rule
https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
```
