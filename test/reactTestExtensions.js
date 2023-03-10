
import ReactDOM from "react-dom/client";
import { act, mockComponent } from "react-dom/test-utils";

export let container;
let reactRoot;

export const initializeReactContainer = () => {
  container = document.createElement("div");
  document.body.replaceChildren(container);
  reactRoot = ReactDOM.createRoot(container);
}

export const render = component =>
  act(() =>
    reactRoot.render(component)
  );

export const renderAndWait = (component) =>
  act(async () => (
    reactRoot.render(component)
  ));

export const renderAdditional = (component) => {
  const container = document.createElement("div");
  act(() =>
    ReactDOM.createRoot(container).render(component)
  );
  return container;
}
export const click = element =>
  act(() => element.click()
  );

export const element = (selector) =>
  document.querySelector(selector);
export const elements = (selector) =>
  Array.from(document.querySelectorAll(selector));
export const typesOf = (elements) =>
  elements.map(element => element.type);
export const textOf = (elements) =>
  elements.map(element => element.textContent);
export const form = (id) => element("form");
export const field = (fieldName) => form().elements[fieldName];

export const submit = (formElement) => {
  const event = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });
  act(() => formElement.dispatchEvent(event));
  return event;
}

export const submitButton = () => element("input[type=submit]");

const originalValueProperty = (reactElement) => {
  const prototype = Object.getPrototypeOf(reactElement);
  return Object.getOwnPropertyDescriptor(
    prototype,
    "value"
  );
}

export const change = (target, value) => {
  originalValueProperty(target).set.call(
    target,
    value
  );
  const event = new Event("change", {
    target,
    bubbles: true,
  });
  act(() => target.dispatchEvent(event));
}

export const labelFor = (fieldName) => element(`label[for=${fieldName}]`);

export const clickAndWait = async (element) =>
  act(async () => click(element));

export const propsOf = (mockComponent) => {
  const lastCall = mockComponent.mock.calls[
    mockComponent.mock.calls.length - 1
  ];
  return lastCall[0];
}

export const withFocus = (target, fn) =>
  act(() => {
    target.focus();
    fn();
    target.blur();
  });

export const buttonWithLabel = (label) =>
  elements("button").find(
    ({ textContent }) => textContent === label
  );

export const changeAndWait = async (target, value) =>
  act(async () => change(target, value));