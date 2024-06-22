import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      'quotes': ['error', 'single'],
      'linebreak-style': ['error', 'unix']
    }
  }
];
