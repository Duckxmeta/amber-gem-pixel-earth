export const keys = new Set<string>();
export const pressed = new Set<string>();

/** Touch / QA: hold or release a KeyboardEvent.code. Edge presses land in `pressed`. */
export function holdKey(code: string, down: boolean) {
  if (down) {
    if (!keys.has(code)) pressed.add(code);
    keys.add(code);
  } else keys.delete(code);
}
