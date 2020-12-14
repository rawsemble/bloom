const registry = {};

type Module = {
  [exportName: string]: any;
};

export function insertModule(specifier: string, url: string): void {
  registry[specifier] = url;
}

export function getModuleUrl(specifier: string): Module | null {
  return registry[specifier] || null;
}

export function createModuleUrl(
  strings: TemplateStringsArray,
  ...imports: string[]
): string {
  const source: string[] = [];
  for (let i = 0; i < strings.length; i++) {
    source.push(strings[i]);
    if (i < imports.length) {
      source.push(resolveImportSpecifier(imports[i]));
    }
  }

  return URL.createObjectURL(
    new Blob(source, { type: "application/javascript" })
  );
}

export function resolveImportSpecifier(specifier: string): string {
  if (registry[specifier]) {
    return registry[specifier];
  } else {
    throw Error(`No module has been created with specifier '${specifier}'`);
  }
}
