import { toBeElementWithTag } from "./toBeElementWithTag";

const stripTerminalColor = (text) =>
  text.replace(/\x1B\[\d+m/g, "");

describe("toBeElementWithTag matcher", () => {
  const elementFrom = (text) => {
    const parent = document.createElement("div");
    parent.innerHTML = text;
    return parent.firstChild;
  }

  it("returns pass is true when the input element of the right tag is found", () => {
    const domElement = elementFrom(
      "<select />"
    )
    const result = toBeElementWithTag(domElement, "SELECT");
    expect(result.pass).toBe(true);
  });

  it("returns pass is false when the element is null", () => {
    const result = toBeElementWithTag(null, "SELECT");
    expect(result.pass).toBe(false);
  });

  it("returns pass is false when the element is the wrong tag", () => {
    const domElement = elementFrom("<p />");
    const result = toBeElementWithTag(domElement, "text");
    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = elementFrom(
      "<p />"
    );
    const result = toBeElementWithTag(
      domElement,
      "tag"
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(
      `expect(element).toBeElementWithTag("tag")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = elementFrom(
      "<tag />"
    );
    const result = toBeElementWithTag(
      domElement,
      "TAG"
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(
      `expect(element).not.toBeElementWithTag("TAG")`
    );
  });

  it("returns a specific message the element passed is null", () => {
    const result = toBeElementWithTag(
      null,
      "text"
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(
      `Actual: element was not found`
    );
  })

  it("returns a message when the element has the wrong tag", () => {
    const domElement = elementFrom("<p />");
    const result = toBeElementWithTag(
      domElement,
      "tag"
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(
      `Actual: <p>`
    );
  })

});