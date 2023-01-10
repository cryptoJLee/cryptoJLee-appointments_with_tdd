import React from "react";
import {
  Appointment,
  AppointmentsDayView,
} from "../src/AppointmentsDayView";
import {
  render,
  click,
  initializeReactContainer,
  element,
  elements,
  textOf,
  typesOf
} from "./reactTestExtensions";

describe("Appointment", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };
  beforeEach(() => {
    initializeReactContainer();
  });

  const appointmentTable = () =>
    document.querySelector(
      "#appointmentView > table"
    );

  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Ashley");
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Jordan");
  });

  it("renders the customer last name", () => {
    const customer = { firstName: "Ashley", lastName: "Kelling" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Ashley Kelling");
  });

  it("renders the customer phone number", () => {
    const customer = { phoneNumber: "(554) 338-1814" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("(554) 338-1814");
  });

  it("renders the stylist", () => {
    render(<Appointment customer={blankCustomer} stylist="Maggie" />);
    expect(appointmentTable()).toContainText("Maggie");
  });

  it("renders another stylist", () => {
    render(<Appointment customer={blankCustomer} stylist="Mage" />);
    expect(appointmentTable()).toContainText("Mage");
  });

  it("renders the service", () => {
    render(<Appointment customer={blankCustomer} service="Beard trim" />);
    expect(appointmentTable()).toContainText("Beard trim");
  });

  it("renders another service", () => {
    render(<Appointment customer={blankCustomer} service="cut" />);
    expect(appointmentTable()).toContainText("cut");
  });

  it("renders the notes", () => {
    render(<Appointment customer={blankCustomer} notes="some notes" />);
    expect(appointmentTable()).toContainText("some notes");
  });

  it("renders another notes", () => {
    render(<Appointment customer={blankCustomer} notes="other notes" />);
    expect(appointmentTable()).toContainText("other notes");
  });

  it("renders the start time", () => {
    const timestamp = new Date().setHours(9, 0);
    render(<Appointment customer={blankCustomer} startsAt={timestamp} />);
    expect(element("h3")).toContainText("appointment at 09:00");
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

  const secondButton = () => elements("button")[1];
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(
      element("div#appointmentsDayView")
    ).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(element("ol")).not.toBeNull();
  })

  it("renders an li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(elements("ol > li")).toHaveLength(2);
  })

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);
    expect(textOf(elements("ol > li"))).toEqual([
      "12:00", "13:00"
    ])
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body).toContainText("There are no appointments scheduled for today");
  });

  it("selects the first appointment by default", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    expect(document.body).toContainText("Ashley");
  });

  it("has a button element in each li", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    expect(typesOf(elements("li > *"))).toEqual([
      "button", "button"
    ]);
  });

  it("renders another appointment when selected", () => {
    render(
      <AppointmentsDayView appointments={twoAppointments} />
    );
    click(secondButton());
    expect(document.body).toContainText("Jordan");
  });

  it("adds toggled class to button when selected", () => {
    render(
      <AppointmentsDayView
        appointments={twoAppointments}
      />
    );
    click(secondButton());
    expect(secondButton()).toHaveClass("toggled");
  });

  it("does not add toggled class if button is not selected", () => {
    render(
      <AppointmentsDayView
        appointments={twoAppointments}
      />
    );
    expect(secondButton()).not.toHaveClass("toggled");
  });
});