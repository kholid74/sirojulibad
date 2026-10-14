import js from '@eslint/js';
import ts from 'typescript-eslint';
export default [{ ignores: ['dist/**', '.astro/**', 'node_modules/**'] }, js.configs.recommended, ...ts.configs.recommended, { files: ['src/scripts/theme.js', 'src/scripts/navigation.js'], languageOptions: { globals: { window: 'readonly', document: 'readonly', Element: 'readonly' } } }, { files: ['**/*.mjs'], languageOptions: { globals: { process: 'readonly', URL: 'readonly', console: 'readonly' } } }];
