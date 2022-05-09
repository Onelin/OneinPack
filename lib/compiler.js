
const { getAST, getDependencies, transform } = require('./parser')
const path =  require('path')
const fs = require('fs')

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry
    this.output = output
    this.modules = []
  }

  run() {
    const entryModule = this.buildModule(this.entry, true)

    this.modules.push(entryModule)

    this.modules.forEach((module) => {
      module.dependencies?.forEach((dependency) => {
        this.modules.push(this.buildModule(dependency, false))
      })
    })

    this.emitFiles()

    console.log('this.modules', this.modules);
  }

  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename)
    } else {
      const absolutePath = path.join(process.cwd(), './src', filename)
      console.log('absolutePath', process.cwd(), absolutePath);
      ast = getAST(absolutePath)
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }
  }

  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename)
    console.log('outputPath', outputPath);
    let moduleStr = ''
    this.modules.forEach(module => {
      moduleStr += `'${module.filename}': function (require, module, exports) { ${module.source} },`
    })
    console.log('moduleStr', moduleStr);
    const bundle = `(function(modules){
      function require(fileName) {
        const fn = modules[fileName];
        const module = { exports: {} };
        fn(require, module, module.exports);
        return module.exports;
      }
      require('${this.entry}');
    })({${moduleStr}})`

    console.log('bundle', bundle);

    fs.writeFileSync(outputPath, bundle, 'utf8')
  }
}