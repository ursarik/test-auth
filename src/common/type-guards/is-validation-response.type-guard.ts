export const isValidationResponse = (
  x: any,
): x is { message: string[]; error: string; statusCode: number } => {
  return (
    typeof x === 'object' &&
    x.message &&
    Array.isArray(x.message) &&
    x.error &&
    x.statusCode
  );
};
