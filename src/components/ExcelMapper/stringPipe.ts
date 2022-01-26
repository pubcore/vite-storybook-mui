export function stringPipe(
  pipe: string | undefined | null,
  values: (string | undefined)[]
) {
  if (pipe) {
    try {
      const pipeFunc = Function("$1", "$2", `return ${pipe}`);
      return pipeFunc(...values);
    } catch (error) {
      return undefined;
    }
  } else {
    return values[0];
  }
}
