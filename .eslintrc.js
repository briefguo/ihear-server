module.exports = {
  'env': {
    'browser' : true,
    'node': true,
    'commonjs': true,
    'es6'     : true
  },
  'extends': 'eslint:recommended',
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx'                             : true,
      // lambda表达式
      'arrowFunctions'                  : true,
      // 解构赋值
      'destructuring'                   : true,
      // class
      'classes'                         : true,
      'defaultParams'                   : true,
      // 块级作用域，允许使用let const
      'blockBindings'                   : true,
      // 允许使用模块，模块内默认严格模式
      'modules'                         : true,
      // 允许字面量定义对象时，用表达式做属性名
      'objectLiteralComputedProperties' : true,
      // 允许对象字面量方法名简写
      'objectLiteralShorthandMethods'   : true,
      'objectLiteralShorthandProperties': true,
      'restParams'                      : true,
      'spread'                          : true,
      'forOf'                           : true,
      'generators'                      : true,
      'templateStrings'                 : true,
      'superInFunctions'                : true,
      'experimentalObjectRestSpread'    : true,
    },
    'sourceType': 'module'
  },
  'plugins': ['react'],
  'rules': {
    //'indent': ['error', 2],
    //'linebreak-style': ['error', 'unix'],
    'comma-dangle': ['error', 'only-multiline'],
    'semi': ['error', 'never'],
    'react/display-name': [1, { 'ignoreTranspilerName': false }],
    'react/forbid-prop-types': [1, { 'forbid': ['any'] }],
    'react/jsx-boolean-value'           : 1,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-curly-spacing'           : 1,
    'react/jsx-indent-props'            : 0,
    'react/jsx-key'                     : 1,
    'react/jsx-max-props-per-line'      : 0,
    'react/jsx-no-bind'                 : 1,
    'react/jsx-no-duplicate-props'      : 1,
    'react/jsx-no-literals'             : 0,
    'react/jsx-no-undef'                : 1,
    'react/jsx-pascal-case'             : 1,
    'react/jsx-sort-prop-types'         : 0,
    'react/jsx-sort-props'              : 0,
    'react/jsx-uses-react'              : 1,
    'react/jsx-uses-vars'               : 1,
    'react/no-danger'                   : 1,
    'react/no-did-mount-set-state'      : 1,
    'react/no-did-update-set-state'     : 1,
    'react/no-direct-mutation-state'    : 1,
    'react/no-multi-comp'               : 1,
    'react/no-set-state'                : 0,
    'react/no-unknown-property'         : 1,
    'react/prefer-es6-class'            : 1,
    'react/prop-types'                  : 1,
    'react/react-in-jsx-scope'          : 1,
    'react/require-extension'           : 1,
    'react/self-closing-comp'           : 1,
    'react/sort-comp'                   : 1,
    'react/wrap-multilines'             : 1,
  },
}
