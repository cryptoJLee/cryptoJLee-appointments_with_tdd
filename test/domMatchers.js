import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/ToBeElementWithTag";

expect.extend({
  toContainText,
  toHaveClass,
  toBeInputFieldOfType,
  toBeElementWithTag,
});

expect.extend({
  toBeCalledWith(received, ...expectedArguments) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy was not called.",
      }
    }

    const notMatch = !this.equals(
      received.receivedArguments(),
      expectedArguments
    );

    if (notMatch) {
      return {
        pass: false,
        message: () =>
          "Spy called with the wrong arguments: " +
          received.receivedArguments() +
          ".",
      }
    }

    return {
      pass: true,
      message: () => "Spy was called.",
    };
  },
});