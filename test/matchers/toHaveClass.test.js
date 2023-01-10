import { toHaveClass } from "./toHaveClass";

const stripTerminalColor = (text) =>
  text.replace(/\x1B\[\d+m/g, "");

describe("toHaveClass matcher", () => {
  it("returns pass is true when the class is found in the given DOM element", () => {
    const domElement = {
      className: "sampleCls"
    };
    const result = toHaveClass(domElement, "sampleCls");
    expect(result.pass).toBe(true);
  });

  it("returns pass is false when the class is not found in the given DOM element", () => {
    const domElement = {
      className: ""
    };
    const result = toHaveClass(domElement, "sampleCls");
    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = { className: "" };
    const result = toHaveClass(
      domElement,
      "sampleCls"
    );
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toHaveClass("sampleCls")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = { className: "class to find" };
    const result = toHaveClass(
      domElement,
      "class to find"
    );
    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(element).not.toHaveClass("class to find")`
    );
  });

  it("returns a message that contains the actual text", () => {
    const domElement = { className: "class to find" };
    const result = toHaveClass(
      domElement,
      "class to find"
    );
    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `Actual class: "class to find"`
    );
  })
});