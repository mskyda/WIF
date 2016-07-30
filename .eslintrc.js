module.exports = {
	root         : true,
	parserOptions: {
		ecmaFeatures: {
			impliedStrict: true
		}
	},
	env: {
		browser: true,
		amd    : true,
		jquery : true,
		jasmine: true
	},
	// We are using eslint's recommended rules (the ones with the check mark in the link)
	// plus some more we find out useful. Please read and refer to http://eslint.org/docs/rules/ for more info.
	extends: 'eslint:recommended',
	rules  : {
		// Possible Errors (most of the recommended rules sit here)
		'no-extra-boolean-cast'    : ['off'], // disallow unnecessary boolean casts (it's one of the recommends). It's off because needs pair programming
		// Best Practices
		'curly'                    : ['error', 'all'], // enforce consistent brace style for all control statements
		'eqeqeq'                   : ['error', 'always'], // require the use of === and !== . It's off because needs pair programming
		'no-alert'                 : ['error'], // disallow the use of alert, confirm, and prompt
		'no-magic-numbers'         : ['off', { 'ignore': [0, 1, -1] }], // disallow magic numbers
		'no-multi-spaces'          : ['error'], // disallow multiple spaces
		'no-multi-str'             : ['error'], // disallow multiline strings
		'yoda'                     : ['error'], // disallow “Yoda” conditions
		// Variables
		// Stylistic Issues
		'array-bracket-spacing'    : ['error', 'always', { 'objectsInArrays': false, 'arraysInArrays': false, 'singleValue': false }], // enforce consistent spacing inside array brackets
		'block-spacing'            : ['error'], // enforce consistent spacing inside single-line block
		'brace-style'              : ['error', '1tbs', { 'allowSingleLine': true }], // enforce consistent brace style for blocks
		'comma-spacing'            : ['error'], // enforce consistent spacing before and after commas (only after allowed)
		'comma-style'              : ['error'], // enforce consistent comma style
		'computed-property-spacing': ['error'], // enforce consistent spacing inside computed property brackets
		'indent'                   : ['error', 'tab', { 'SwitchCase': 1 }],  // enforce consistent indentation
		'key-spacing'              : ['error', { 'beforeColon': false, 'afterColon': true, 'align': 'colon' }], // enforce consistent spacing between keys and values in object literal properties
		'linebreak-style'          : ['error', 'unix'], // enforce consistent linebreak style
		'new-cap'                  : ['error'], // require constructor function names to begin with a capital letter
		'newline-after-var'        : ['error'], //require an empty line after var declarations
		'newline-before-return'    : ['error'], // require an empty line before return statements
		'newline-per-chained-call' : ['error', { 'ignoreChainWithDepth': 3 }], // require a newline after each call in a method chain
		'no-bitwise'               : ['error', { 'allow': ['~'] } ], // disallow bitwise operators, but not ~
		'no-multiple-empty-lines'  : ['error', { 'max': 1 } ], // disallow multiple empty lines
		'object-curly-newline'     : ['error'], // enforce consistent line breaks inside braces
		'object-curly-spacing'     : ['error', 'always', { 'objectsInObjects': false, 'arraysInObjects': false }], // enforce consistent spacing inside braces
		'quotes'                   : ['error', 'single'], // enforce consistent use of single quotes
		'require-jsdoc'            : ['error', { 'require': { 'FunctionDeclaration': true, 'MethodDefinition': true, 'ClassDeclaration': true } }], // require JSDoc comments
		'semi'                     : ['error', 'always'], // enforce the use of semicolons
		'spaced-comment'           : ['error', 'always', { 'exceptions': ['*'] }] // enforce consistent spacing after the // or /* in a comment
	},
	globals: {
		_              : false,
		swfobject      : false,
		productJSON    : false,
		loadDataFoldout: false // False = Read-only
	}
};