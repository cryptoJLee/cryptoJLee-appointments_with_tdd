import React from "react";
import ReactDOM from "react-dom";
import { Appointment } from "../src/Appointment";

describe("Appointment", () => {
  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    const component = (
      <Appointment customer={customer} />
    );
    const container = document.createElement("div");
    document.body.appendChild(container);

    ReactDOM.createRoot(container).render(component);

    expect(document.body.textContent).toContain("Ashley");
  });
})