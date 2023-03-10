import React from "react";
import { act } from "react-dom/test-utils";
import {
  initializeReactContainer,
  render,
  form,
  field,
  element,
  submitButton,
  change,
  labelFor,
  click,
  clickAndWait,
  withFocus,
  textOf,
  elements,
} from "./reactTestExtensions";
import {
  fetchResponseOk,
  fetchResponseError
} from "./builders/fetch";
import { blankCustomer, validCustomer } from "./builders/customer";
import { bodyOfLastFetchRequest } from "./spyHelpers";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {

  beforeEach(() => {
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk({}));
  });

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
      const customer = { ...validCustomer, [fieldName]: value };
      render(<CustomerForm original={customer} onSave={() => { }} />);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });
  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={validCustomer} onSave={() => { }} />);
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        ...validCustomer,
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
        original={validCustomer}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  })

  it("calls fetch with the right configuration", async () => {
    render(
      <CustomerForm
        original={validCustomer}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(global.fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  })

  it("renders field validation errors from server", async () => {
    const errors = {
      phoneNumber: "Phone number already exists in the system"
    };
    global.fetch.mockResolvedValue(
      fetchResponseError(422, { errors })
    );
    render(<CustomerForm original={validCustomer} />);
    await clickAndWait(submitButton());
    expect(errorFor("phoneNumber")).toContainText(
      errors.phoneNumber
    );
  })

  it("notifies onSave when form is submitted", async () => {
    const customer = { ...validCustomer };
    global.fetch.mockResolvedValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(
      <CustomerForm
        original={customer}
        onSave={saveSpy}
      />
    );
    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalledWith(customer);
  })

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue(fetchResponseError());
    })
    it("does not notify onSave", async () => {
      const saveSpy = jest.fn();

      render(
        <CustomerForm
          original={validCustomer}
          onSave={saveSpy}
        />
      );
      await clickAndWait(submitButton());
      expect(saveSpy).not.toBeCalled();
    })
    it("renders error message", async () => {

      render(<CustomerForm original={validCustomer} />);
      await clickAndWait(submitButton());

      expect(element("[role=alert]")).toContainText("error occurred");
    })
    it("error is cleared when the form is submitted with all validation errors corrected", async () => {

      render(<CustomerForm original={validCustomer} onSave={() => { }} />);
      await clickAndWait(submitButton());
      expect(element("[role=alert]")).toContainText("error occurred");
      global.fetch.mockResolvedValue(fetchResponseOk({}));
      await clickAndWait(submitButton());
      expect(element("[role=alert]")).not.toContainText("error occurred");
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

  const errorFor = (fieldName) =>
    element(`#${fieldName}Error[role=alert]`);

  describe("validation", () => {
    const itRendersAlertForFieldValidation = (fieldName) => {
      it(`renders an alert space for ${fieldName} validation errors`, () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(errorFor(fieldName)).not.toBeNull();
      });
    };
    itRendersAlertForFieldValidation("firstName");

    const itSetsAlertAsAccessibleDescriptionForField = (fieldName) => {
      it(`sets alert as the accessible description for the ${fieldName} field`, () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(
          field(fieldName).getAttribute("aria-describedby")
        ).toEqual(`${fieldName}Error`);
      });
    };
    itSetsAlertAsAccessibleDescriptionForField("firstName");

    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        render(<CustomerForm original={blankCustomer} />);
        withFocus(field(fieldName), () =>
          change(field(fieldName), value)
        );
        expect(
          errorFor(fieldName)
        ).toContainText(description);
      })
    };
    itInvalidatesFieldWithValue("firstName", " ", "First name is required");

    const itInitiallyHasNoTextInTheAlertSpace = (fieldName) => {
      it(`initially has no text in the ${fieldName} field alert space`, async () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(
          errorFor(fieldName).textContent
        ).toEqual("");
      });
    };
    itInitiallyHasNoTextInTheAlertSpace("firstName");

    const itClearsValidationErrorsWhenChange = (
      fieldName,
      correctValue,
    ) => {
      it("clears validation error when the user corrects", () => {
        render(<CustomerForm original={blankCustomer} />);
        withFocus(field(fieldName), () =>
          change(field(fieldName), "")
        );
        change(field(fieldName), correctValue);
        expect(
          errorFor(fieldName).textContent
        ).toEqual("");
      });
    };
    itClearsValidationErrorsWhenChange("firstName", "s");

    const itDoesNotInvalidateFieldOnKeypress = (
      fieldName,
      fieldValue
    ) => {
      it(`does not invalidate ${fieldName} field on keypress`, async () => {
        render(
          <CustomerForm original={validCustomer} />
        );
        change(field(fieldName), fieldValue);
        expect(
          errorFor(fieldName).textContent
        ).toEqual("");
      });
    };
    itDoesNotInvalidateFieldOnKeypress("firstName", "");

    itRendersAlertForFieldValidation("lastName");
    itSetsAlertAsAccessibleDescriptionForField("lastName");
    itInvalidatesFieldWithValue("lastName", " ", "Last name is required");
    itInitiallyHasNoTextInTheAlertSpace("lastName");
    itClearsValidationErrorsWhenChange("lastName", "s");
    itDoesNotInvalidateFieldOnKeypress("lastName", "");

    itRendersAlertForFieldValidation("phoneNumber");
    itSetsAlertAsAccessibleDescriptionForField("phoneNumber");
    itInvalidatesFieldWithValue(
      "phoneNumber",
      "invalid",
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );
    itInitiallyHasNoTextInTheAlertSpace("phoneNumber");
    itClearsValidationErrorsWhenChange("phoneNumber", "1");
    itDoesNotInvalidateFieldOnKeypress("phoneNumber", "");

    it("accepts standard phone number characters when validating", () => {
      render(<CustomerForm original={blankCustomer} />);
      withFocus(field("phoneNumber"), () =>
        change(field("phoneNumber"), "0123456789+()- ")
      );
      expect(errorFor("phoneNumber")).not.toContainText("Only numbers");
    })
  })

  it("does not submit the form when there are validation errors", async () => {
    render(<CustomerForm original={blankCustomer} />);
    await clickAndWait(submitButton());
    expect(global.fetch).not.toBeCalled();
  })

  it("renders validation errors after submission fails", async () => {
    render(<CustomerForm original={blankCustomer} />);
    await clickAndWait(submitButton());
    expect(
      textOf(elements("[role=alert]"))
    ).not.toEqual("");
  })

  describe("submitting indicator", () => {
    it("displays when form is submitting", async () => {
      render(
        <CustomerForm
          original={validCustomer}
          onSave={() => { }}
        />
      );
      click(submitButton());
      await act(async () => {
        expect(
          element("span.submittingIndicator")
        ).not.toBeNull();
      });
    })

    it("initially does not display the submitting indicator", () => {
      render(<CustomerForm original={validCustomer} />);
      expect(element(".submittingIndicator")).toBeNull();
    })

    it("hides after submission", async () => {
      render(
        <CustomerForm
          original={validCustomer}
          onSave={() => { }}
        />
      );
      await clickAndWait(submitButton());
      expect(element(".submittingIndicator")).toBeNull();
    })
  });

  describe("submit button", () => {
    it("renders a submit button", () => {
      render(
        <CustomerForm original={blankCustomer} />
      );
      expect(submitButton()).not.toBeNull();
    });

    it("disables the submit button when submitting", async () => {
      render(
        <CustomerForm
          original={validCustomer}
          onSave={() => { }}
        />
      );
      click(submitButton());
      await act(async () => {
        expect(submitButton().disabled).toBeTruthy();
      });
    })

    it("initially does not disable submit button", () => {
      render(
        <CustomerForm original={validCustomer} />
      );
      expect(submitButton().disabled).toBeFalsy();
    })
  })
});