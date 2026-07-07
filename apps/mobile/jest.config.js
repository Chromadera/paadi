const { defaults: tsjPreset } = require("ts-jest");

module.exports = {
  ...tsjPreset,
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|expo-router|expo-secure-store|zustand|@tanstack/react-query)",
  ],
  setupFiles: ["./jest.setup.js"],
};
