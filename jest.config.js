const config = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  testPathIgnorePatterns: ["integration-tests"],
  setupFiles: ["./jest.setup.js"],
};

module.exports = config;
