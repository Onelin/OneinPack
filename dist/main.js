(function(modules){
      function require(fileName) {
        const fn = modules[fileName];
        const module = { exports: {} };
        fn(require, module, module.exports);
        return module.exports;
      }
      require('/Users/hose/Desktop/Onein/code/Oneinpack/src/index.js');
    })({'/Users/hose/Desktop/Onein/code/Oneinpack/src/index.js': function (require, module, exports) { "use strict";

var _onein = require("./onein.js");

document.write((0, _onein.onein)('Onein')); },'./onein.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onein = onein;

function onein(name) {
  return 'hello ' + name;
}

function test() {
  console.log('会打包吗');
} },})