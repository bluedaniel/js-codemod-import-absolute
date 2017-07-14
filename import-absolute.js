const fs = require('fs');
const path = require('path');

const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

export const shouldReplace = path =>
  path.startsWith(CURRENT_DIRECTORY_PREFIX) ||
  path.startsWith(PARENT_DIRECTORY_PREFIX);

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
