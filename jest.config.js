module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Transpile both .js and .jsx files using babel-jest
  },
  testEnvironment: 'jsdom', // Use jsdom for simulating a browser-like environment
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js', // Mock CSS imports
    '\\.svg$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': 'identity-obj-proxy',
  },
};
