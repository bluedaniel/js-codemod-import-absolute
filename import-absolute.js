const fs = require('fs');
const path = require('path');
const { shouldReplace } = require('./helpers/matchers');

export default (file, api, opts) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const modifier = opts.replace
    ? x => x.replace(opts.replace, opts.replaceWith || '')
    : x => x;

  const filePath = path.resolve(
    process.cwd(),
    path.dirname(file.path)
  );

  return root
    .find(j.ImportDeclaration)
    .forEach(p => {
      const importValue = p.value.source.value;

      if (shouldReplace(importValue)) {
        const absolutePath = path.resolve(filePath, importValue);
        p.value.source.value = modifier(absolutePath);
      }
    })
    .toSource();
};
