module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/src/__mocks__/react-native.js',
    '^@expo/vector-icons$': '<rootDir>/src/__mocks__/expo-vector-icons.js',
    '^react-native-drax$': '<rootDir>/src/__mocks__/react-native-drax.js',
    '^react-native-vector-icons': '<rootDir>/src/__mocks__/react-native-vector-icons.js',
  },
}; 