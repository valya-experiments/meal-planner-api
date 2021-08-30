export function getEnvVar(varName: string): string {
  const varValue = process.env[varName];

  if (!varValue?.length) {
    throw new Error(`${varName} is required, but it is not defined`);
  }

  return varValue;
}
