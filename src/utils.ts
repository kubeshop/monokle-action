export async function wait(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds));
}
