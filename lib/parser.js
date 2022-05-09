const fs = require('fs')
const { parse, transformFromAst, traverse } = require('@babel/core')


module.exports = {
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf8');
    console.log('source', source);
    return parse(source, {
      sourceType: 'module'
    })
  },
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value)
      }
    });
    console.log('dependencies', dependencies);
    return dependencies
  },
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    })
    console.log('code', code);
    return code
  }
}