import { randomInt } from "crypto";

const MAX_SAFE = 2 ** 48 - 1; //Max int that can be safely reached by randomInt

export function generateString(length) {
  return randomInt(MAX_SAFE).toString(36).substring(1, length).toUpperCase();
}
