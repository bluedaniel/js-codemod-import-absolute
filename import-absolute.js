const path = require('path');
const { shouldReplace } = require('./helpers/matchers');

export default (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const filePath = path.resolve(
    process.cwd(),
    file.path.replace(/\.[^/.]+$/, '') // remove ext
  );

  return root
    .find(j.ImportDeclaration)
    .forEach(node => {
      const importValue = node.value.source.value;

      if (shouldReplace(importValue)) {
        const absolutePath = path.resolve(filePath, importValue);
        node.value.source.value = absolutePath;
      }
    })
    .toSource();
};
