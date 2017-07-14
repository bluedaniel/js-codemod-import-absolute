import fs from 'fs';
import path from 'path';
import {
  ascend,
  compose,
  descend,
  identity,
  indexOf,
  map,
  reverse,
  sortWith,
  takeLast
} from 'ramda';
import resolveImportType from 'eslint-plugin-import/lib/core/importType';

// Get the import type via `eslint-plugin-import`
const getType = x => resolveImportType(x, { report: () => ({}), settings: {} });

// Airbnb sorting
const order = ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'];

// Scoring for import value
const getOrderScore = val => indexOf(getType(val), reverse(order));

// Sort func
const sortImports = sortWith([
  descend(x => getOrderScore(x.source.value)),
  ascend(x => x.source.value)
]);

// Last 3 items of order should be absolute paths
export const shouldReplace = type => takeLast(3, order).includes(type);

// Function to rename the import value
export const renamePath = (filePath, modifier) => p => {
  const importValue = p.source.value;
  const importType = getType(importValue);

  if (shouldReplace(importType)) {
    const absolutePath = path.resolve(filePath, importValue);
    p.source.value = modifier(absolutePath);
  }
  return p;
};

export default (file, api, opts) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const modifier = opts.replace
    ? x => x.replace(opts.replace, opts.replaceWith || '')
    : identity;

  const filePath = path.resolve(process.cwd(), path.dirname(file.path));

  const imports = root.find(j.ImportDeclaration);

  const newImports = compose(
    map(renamePath(filePath, modifier)),
    sortImports,
    x => x.nodes()
  )(imports);

  imports.remove();

  return root.find(j.Statement).at(0).insertBefore(newImports).toSource();
};
