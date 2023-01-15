import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/ToBeElementWithTag";
import {
  toBeRenderedWithProps,
  toBeFirstRenderedWithProps
} from "./matchers/toBeRenderedWithProps";
import {
  toBeRendered
} from "./matchers/toBeRendered";

expect.extend({
  toContainText,
  toHaveClass,
  toBeInputFieldOfType,
  toBeElementWithTag,
  toBeRenderedWithProps,
  toBeFirstRenderedWithProps,
  toBeRendered,
});
