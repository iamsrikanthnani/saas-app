export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    throw new Error(`Error: ${error}`);
  } else {
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
