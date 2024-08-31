module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/app/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['/test/*.test.ts'],
};
