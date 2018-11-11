module.exports = {
  collectCoverage: true,
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [151001]
      },
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/*.test.+(ts|tsx|js)"],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
