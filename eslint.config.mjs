import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  globalIgnores(['.next/**', '.source/**', 'node_modules/**']),
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
