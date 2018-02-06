import path from 'path';
import {
  applySpec,
  ascend,
  compose,
  descend,
  identity,
  indexOf,
  lensPath,
  map,
  nth,
  prop,
  propOr,
  replace,
  reverse,
  set,
  sortWith,
  takeLast,
  when,
} from 'ramda';
import resolveImportType from 'eslint-plugin-import/lib/core/importType';

// Get the import type via `eslint-plugin-import`
const getType = x => resolveImportType(x, { report: () => ({}), settings: {} });

// Airbnb sorting order
const order = ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'];

// Sort imports on type and then by name
const sortImports = sortWith([
  descend(([, x]) => indexOf(x, reverse(order), x)),
  ascend(([x]) => x.source.value),
]);

// Last 3 items of order should be absolute paths
const shouldReplace = type => takeLast(3, order).includes(type);

// Function to rename the import value
const renamePath = (filePath, modifier) => p => {
  const importValue = p.source.value;
  const importType = getType(importValue);

  if (shouldReplace(importType)) {
    const absolutePath = path.join(filePath, importValue);
    return set(lensPath(['source', 'value']), modifier(absolutePath), p);
  }
  return p;
};

// Options with defaults
const getOptions = applySpec({
  absolutePath: prop('absolutePath'),
  replace: prop('replace'),
  replaceWith: propOr('', 'replaceWith'),
  sort: propOr(true, 'sort'),
});

export default (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const opts = getOptions(options);

  const modifier = opts.replace
    ? replace(opts.replace, opts.replaceWith)
    : identity;

  const currDir = process.cwd();

  // Get absolute path
  const filePath = compose(
    when(() => opts.absolutePath, replace(currDir, opts.absolutePath)),
    x => path.resolve(currDir, path.dirname(x.path))
  )(file);

  const imports = root.find(j.ImportDeclaration);

  // Rename imports with absolute path, also sort if option given
  const newImports = compose(
    map(compose(renamePath(filePath, modifier), nth(0))),
    opts.sort ? sortImports : identity,
    map(x => [x, getType(x.source.value)]),
    x => x.nodes()
  )(imports);

  // Insert new imports
  j(imports.at(0).get()).insertBefore(newImports);

  // Remove old imports
  imports.remove();

  return root.toSource();
};
