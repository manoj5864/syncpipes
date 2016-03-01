System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "EAToMysql/*": "src/components/EAToMySql/*.js",
    "excelToMysql/*": "src/components/excelToMySql/*.js",
    "excelToSC/*": "src/components/excelToSC/*.js",
    "components/*": "src/components/*.js",
    "views/*": "src/views/*",
    "app/*": "src/*.js",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "FileSaver": "npm:FileSaver@0.10.0",
    "angular": "github:angular/bower-angular@1.5.0",
    "angular-material": "npm:angular-material@1.0.5",
    "angular-resource": "npm:angular-resource@1.5.0",
    "angular-route": "github:angular/bower-angular-route@1.4.7",
    "angular-ui-bootstrap": "npm:angular-ui-bootstrap@1.0.3",
    "babel": "npm:babel-core@5.8.33",
    "babel-runtime": "npm:babel-runtime@5.8.29",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "core-js": "npm:core-js@1.2.5",
    "css": "github:systemjs/plugin-css@0.1.20",
    "font-awesome": "npm:font-awesome@4.4.0",
    "ngStorage": "github:gsklee/ngStorage@0.3.10",
    "js-xlsx": "github:SheetJS/js-xlsx@0.8.0",
    "json-schema-parser": "npm:json-schema-parser@0.1.0",
    "ngStorage": "github:gsklee/ngStorage@0.3.10",
    "nomnoml": "npm:nomnoml@0.0.3",
    "text": "github:systemjs/plugin-text@0.0.3",
    "traverse": "npm:traverse@0.6.6",
    "github:angular/bower-angular-animate@1.5.0": {
      "angular": "github:angular/bower-angular@1.5.0"
    },
    "github:angular/bower-angular-aria@1.5.0": {
      "angular": "github:angular/bower-angular@1.5.0"
    },
    "github:angular/bower-angular-route@1.4.7": {
      "angular": "github:angular/bower-angular@1.5.0"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "github:components/jquery@2.2.0"
    },
    "npm:angular-material@1.0.5": {
      "angular": "github:angular/bower-angular@1.5.0",
      "angular-animate": "github:angular/bower-angular-animate@1.5.0",
      "angular-aria": "github:angular/bower-angular-aria@1.5.0",
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.29": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.5": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:font-awesome@4.4.0": {
      "css": "github:systemjs/plugin-css@0.1.20"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:json-pointer@0.3.0": {
      "foreach": "npm:foreach@2.0.5"
    },
    "npm:json-schema-parser@0.1.0": {
      "json-pointer": "npm:json-pointer@0.3.0"
    },
    "npm:lodash@3.7.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nomnoml@0.0.3": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "lodash": "npm:lodash@3.7.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
