import isBuiltinModule from 'is-builtin-module';

const CURRENT_DIRECTORY_PREFIX = './';
const PARENT_DIRECTORY_PREFIX = '../';

const isExternalModule = path =>
  /^@?[\w-]+$/.test(path) && !isBuiltinModule(path);

const isInternalModule = path => /^[\w-]+(\/[\w-]+)+$/.test(path);

const isLocalModuleFromParentDirectory = path =>
  path.startsWith(PARENT_DIRECTORY_PREFIX);

const isLocalModuleCurrentDirectoryIndex = path =>
  path === CURRENT_DIRECTORY_PREFIX;

const isLocalModuleFromSiblingDirectory = path =>
  !isLocalModuleCurrentDirectoryIndex(path) &&
  path.startsWith(CURRENT_DIRECTORY_PREFIX);

export const matchers = {
  builtin: isBuiltinModule,
  external: isExternalModule,
  internal: isInternalModule,
  parent: isLocalModuleFromParentDirectory,
  index: isLocalModuleCurrentDirectoryIndex,
  sibling: isLocalModuleFromSiblingDirectory
};

export const shouldReplace = val =>
  matchers.internal(val) ||
  matchers.parent(val) ||
  matchers.index(val) ||
  matchers.sibling(val);
