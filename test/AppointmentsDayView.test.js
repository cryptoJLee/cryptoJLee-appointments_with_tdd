import React from "react";
import ReactDOM from "react-dom/client";
import {
  Appointment,
  AppointmentsDayView,
} from "../src/AppointmentsDayView";
import { act } from "react-dom/test-utils";
import { container, initializeReactContainer } from "./reactTestExtensions";

describe("Appointment", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  const render = component =>
    act(() =>
      ReactDOM.createRoot(container).render(component)
    );

  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("Ashley");
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("Jordan");
  });

  it("renders the customer last name", () => {
    const customer = { firstName: "Ashley", lastName: "Kelling" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("Ashley Kelling");
  });

  it("renders the customer phone number", () => {
    const customer = { phoneNumber: "(554) 338-1814" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("(554) 338-1814");
  });

  it("renders the customer stylist", () => {
    const customer = { stylist: "Maggie" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("Maggie");
  });

  it("renders the customer service", () => {
    const customer = { service: "Beard trim" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("Beard trim");
  });

  it("renders the customer notes", () => {
    const customer = { notes: "some notes" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("some notes");
  });

  it("renders the customer notes", () => {
    const customer = { notes: "some notes" };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("some notes");
  });

  it("renders the start time", () => {
    const customer = { startsAt: new Date().setHours(9, 0) };
    render(<Appointment customer={customer} />);
    expect(document.body.textContent).toContain("appointment at 09:00");
  });
});

describe("AppointmentsDayView", () => {
  const today = new Date();
  const twoAppointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: { firstName: "Ashley" },
    },
    {
      startsAt: today.setHours(13, 0),
      customer: { firstName: "Jordan" },
    },
  ]

  beforeEach(() => {
    initializeReactContainer();
  });

  const render = component =>
    act(() =>
      ReactDOM.createRoot(container).render(component)
    );

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(
      document.querySelector("div#appointmentsDayView")
    ).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const listElement = document.querySelector("ol");
    expect(listElement).not.toBeNull();
  })

  it("renders an li for each appointment", () => {

    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = document.querySelectorAll("ol > li");
    expect(listChildren).toHaveLength(2);
  })

  it("renders the time of each appointment", () => {

    render(<AppointmentsDayView appointments={twoAppointments} />);
    const listChildren = document.querySelectorAll("ol > li");
    expect(listChildren[0].textContent).toEqual("12:00");
    expect(listChildren[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body.textContent).toContain("There are no appointments scheduled for today");
  });

  it("selects the first appointment by default", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    expect(document.body.textContent).toContain("Ashley");
  });

  it("has a button element in each li", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    const buttons = document.querySelectorAll("li > button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when selected", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    const button = document.querySelectorAll("button")[1];
    act(() => button.click());
    expect(document.body.textContent).toContain("Jordan");
  })
});