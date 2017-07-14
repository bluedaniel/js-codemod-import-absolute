# JS Codemod Import Absolute

Codemod to replace relative imports with absolute or custom paths.

Will replace all imports starting `./` or `../`

```javascript
// jscodeshift -t import-absolute.js <file>

- import "./I18n/I18n";
+ import "/Users/xx/project/src/I18n/I18n";

// jscodeshift -t import-absolute.js <file> --replace /Users/xx/project/src --replaceWith src/root
- import "./I18n/I18n";
+ import "src/root/I18n/I18n";
```

## Installing

A quick introduction of the minimal setup you need to get a hello world up &
running.

```shell
$ git clone https://github.com/bluedaniel/js-codemod-import-absolute.git
$ cd js-codemod-import-absolute
$ npm i
```

## Options

```shell
--replace
Replace a string in the new path

--replaceWith
Replaces any occurances of the string specified in `--replace`. Default is ''
```
