import { getEnvVar } from "./getEnvVar";

beforeEach(() => {
  jest.resetAllMocks();
});

test("returns value from process.env", () => {
  process.env.EXISTING_ENV_VAR = "GOOD_RESULT";

  const result = getEnvVar("EXISTING_ENV_VAR");

  expect(result).toBe("GOOD_RESULT");
});

test("throws when value is missing", () => {
  expect(() => getEnvVar("MISSING_ENV_VAR")).toThrowError(
    /MISSING_ENV_VAR is required/
  );
});
