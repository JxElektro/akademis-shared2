module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
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
    '^@expo/vector-icons$': '<rootDir>/src/__mocks__/expo-vector-icons.js',
    '^react-native-drax$': '<rootDir>/src/__mocks__/react-native-drax.js',
    '^react-native-vector-icons': '<rootDir>/src/__mocks__/react-native-vector-icons.js',
    '^react-native\/Libraries\/Animated\/NativeAnimatedHelper$': '<rootDir>/src/__mocks__/NativeAnimatedHelper.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
}; 