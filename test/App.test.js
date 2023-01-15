import React from "react";
import {
  click,
  element,
  initializeReactContainer,
  propsOf,
  render,
} from "./reactTestExtensions";
import { App } from "../src/App";
import {
  AppointmentsDayViewLoader
} from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { act } from "react-dom/test-utils";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";

jest.mock("../src/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => (
    <div id="AppointmentsDayViewLoader" />
  ))
}));
jest.mock("../src/CustomerForm", () => ({
  CustomerForm: jest.fn(() => (
    <div id="CustomerForm" />
  )),
}));
jest.mock("../src/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => (
    <div id="AppointmentFormLoader" />
  )),
}));

const exampleCustomer = { id: 123 };
const saveCustomer = (customer = exampleCustomer) =>
  act(() => propsOf(CustomerForm).onSave(customer));

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentsDayViewLoader", () => {
    render(<App />);
    expect(AppointmentsDayViewLoader).toBeRendered();
  })

  it("has a menu bar", () => {
    render(<App />);
    expect(element("menu")).not.toBeNull();
  })

  it("has a button to initiate add customer and appointment action", () => {
    render(<App />);
    const firstButton = element(
      "menu > li > button:first-of-type"
    );
    expect(firstButton).toContainText(
      "Add customer and appointment"
    );
  })

  const beginAddingCustomerAndAppointment = () =>
    click(element("menu > li > button:first-of-type"));

  it("displays the CustomerForm when button is clicked", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    expect(element("#CustomerForm")).not.toBeNull();
  })

  it("passes a blank original customer object to CustomerForm", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    expect(CustomerForm).toBeRenderedWithProps(
      expect.objectContaining({
        original: blankCustomer
      })
    )
  })

  it("hides the AppointmentsDayViewLoader when button is clicked", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    expect(
      element("#AppointmentsDayViewLoader")
    ).toBeNull();
  })

  it("hides the button bar when CustomerForm is being displayed", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    expect(element("menu")).toBeNull();
  })

  it("displays the AppointmentFormLoader after the CustomerForm is submitted", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    saveCustomer();

    expect(
      element("#AppointmentFormLoader")
    ).not.toBeNull();
  })

  it("pases a blank original appointment object to CustomerForm", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    saveCustomer();
    expect(AppointmentFormLoader).toBeRenderedWithProps(
      expect.objectContaining({
        original:
          expect.objectContaining(blankAppointment)
      })
    )
  })

  it("passes the customer to the AppointmentForm", async () => {
    const customer = { id: 123 };
    render(<App />);
    beginAddingCustomerAndAppointment();
    saveCustomer(customer);
    expect(AppointmentFormLoader).toBeRenderedWithProps(
      expect.objectContaining({
        original: expect.objectContaining({
          customer: customer.id,
        })
      })
    )
  })

  const saveAppointment = () =>
    act(() => propsOf(AppointmentFormLoader).onSave());
  it("renders AppointmentDayViewLoader after AppointmentForm is submitted", async () => {
    render(<App />);
    beginAddingCustomerAndAppointment();
    saveCustomer();
    saveAppointment();
    expect(AppointmentsDayViewLoader).toBeRendered();
  })
})