import React from "react";
import {
  initializeReactContainer,
  render,
  form,
  field,
  element,
  submit,
  submitButton,
  change,
  labelFor,
  clickAndWait,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

let returnValue;
const spy = () => {
  let receivedArguments;
  return {
    fn: (...arg) => {
      receivedArguments = arg;
      return returnValue;
    },
    stubReturnValue: value => returnValue = value,
    receivedArguments: () => receivedArguments,
    receivedArgument: n => receivedArguments[n]
  };
};
const fetchResponseOk = (body) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body)
  });
const fetchResponseError = () =>
  Promise.resolve({ ok: false });

describe("CustomerForm", () => {
  const originalFetch = global.fetch;
  let fetchSpy;

  beforeEach(() => {
    initializeReactContainer();
    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  const bodyOfLastFetchRequest = () =>
    JSON.parse(fetchSpy.receivedArgument(1).body);

  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  }

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} onSave={() => { }} />);
      expect(field(fieldName)).toBeInputFieldOfType("text");
    });
  const itIncludesTheExistingValue = (
    fieldName,
    existing
  ) =>
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing };
      render(<CustomerForm original={customer} />);
      expect(field(fieldName).value).toEqual(existing);
    });
  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the text box", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });
    it(`renders '${text}' as the label content`, () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(labelFor(fieldName)).toContainText(text);
    })
  };
  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} />);
      expect(field(fieldName).id).toEqual(fieldName);
    })
  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value };
      render(<CustomerForm original={customer} onSave={() => { }} />);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });
  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => { }} />);
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: value,
      })
    });
  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(form()).not.toBeNull();
  });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName", "Ashley");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName", "Ashley");
    itSubmitsNewValue("firstName", "Jamie");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName", "Ashley");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue("lastName", "Ashley");
    itSubmitsNewValue("lastName", "Jamie");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber", "012345");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "012345");
    itSubmitsNewValue("phoneNumber", "7890");
  });

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(submitButton()).not.toBeNull();
  })

  it("sends request to POST /customers when submitting the form", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(fetchSpy).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  })

  it("calls fetch with the right configuration", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(fetchSpy).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  })

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();

    render(
      <CustomerForm
        original={customer}
        onSave={saveSpy.fn}
      />
    );
    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalledWith(customer);
  })

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      fetchSpy.stubReturnValue(fetchResponseError());
    })
    it("does not notify onSave", async () => {
      const saveSpy = spy();

      render(
        <CustomerForm
          original={blankCustomer}
          onSave={saveSpy.fn}
        />
      );
      await clickAndWait(submitButton());
      expect(saveSpy).not.toBeCalledWith();
    })
    it("renders error message", async () => {

      render(<CustomerForm original={blankCustomer} />);
      await clickAndWait(submitButton());

      expect(element("[role=alert]")).toContainText("error occurred");
    })
  });

  it("renders an alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toBeNull();
  })

  it("initially have no text in the alert space", async () => {
    render(<CustomerForm original={blankCustomer} />);
    expect(element("[role=alert]")).not.toContainText("error occurred");
  })
});