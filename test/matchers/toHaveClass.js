import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toHaveClass = (
  received,
  expectedClass
) => {
  const pass = received.className.includes(expectedClass);
  const sourceHint = () =>
    matcherHint(
      "toHaveClass",
      "element",
      printExpected(expectedClass),
      { isNot: pass }
    );
  const actualClassHint = () =>
    "Actual class: " +
    printReceived(received.className);
  const message = () =>
    [sourceHint(), actualClassHint()].join("\n\n");

  return { pass, message }
}