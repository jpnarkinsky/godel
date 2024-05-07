/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: [
    'tests/.*$',
    'lib/.*\.test\.ts',
  ]
};