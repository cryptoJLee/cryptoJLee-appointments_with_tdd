import React from "react";
import {
  initializeReactContainer,
  render,
  field,
  form,
  element,
  elements,
  submitButton,
  click,
  labelFor,
  change,
  clickAndWait,
} from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";
import {
  today,
  todayAt,
  tomorrowAt
} from "./builders/time";
import { fetchResponseError, fetchResponseOk } from "./builders/fetch";
import { blankAppointment } from "./builders/appointment";
import { bodyOfLastFetchRequest } from "./spyHelpers";

describe("AppointmentForm", () => {
  beforeEach(() => {
    initializeReactContainer();
    jest.
      spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk({}));
  });
  const availableTimeSlots = [
    {
      startsAt: todayAt(9),
      stylists: ["Ashley", "Jo"],
    },
    {
      startsAt: todayAt(9, 30),
      stylists: ["Ashley"],
    },
  ];

  const services = ["Cut", "Blow-dry"];
  const stylists = ["Ashley", "Jo"];
  const testProps = {
    today,
    selectableServices: services,
    selectableStylists: stylists,
    availableTimeSlots,
    original: blankAppointment,
  };

  const labelsOfAllOptions = (element) =>
    Array.from(
      element.childNodes,
      (node) => node.textContent
    );

  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };
  const startsAtField = (index) => elements("input[name=startsAt]")[index];
  it("renders a form", () => {
    render(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("saves existing value when submitted", async () => {
    const appointment = {
      startsAt: availableTimeSlots[1].startsAt
    };
    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(bodyOfLastFetchRequest()).toMatchObject(appointment);
  });

  it("saves new value when submitted", async () => {
    const appointment = {
      startsAt: availableTimeSlots[0].startsAt
    };
    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={() => { }}
      />
    );
    click(startsAtField(1));
    await clickAndWait(submitButton());
    expect(bodyOfLastFetchRequest()).toMatchObject({
      startsAt: availableTimeSlots[1].startsAt
    });
  })

  it("submits customer(ID) when submitted", async () => {
    const appointment = {
      customer: 123
    };
    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(bodyOfLastFetchRequest()).toMatchObject(appointment);
  });

  const itRendersAsASelectBox = (fieldName) => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName)).toBeElementWithTag(
        "select"
      );
    });
  };

  const itInitiallyHasABlankValueChosen = (
    fieldName
  ) => {
    it("has a blank value as the first value", () => {
      render(
        <AppointmentForm
          {...testProps}
          original={blankAppointment}
        />
      );
      const firstOption =
        field(fieldName).childNodes[0];
      expect(firstOption.value).toEqual("");
    });
  };

  const itPreselectsExistingValue = (
    fieldName,
    existing
  ) => {
    it("pre-selects the existing value", () => {
      const appointment = { [fieldName]: existing };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      const option = findOption(
        field(fieldName),
        existing
      );
      expect(option.selected).toBe(true);
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label for the field", () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`render '${text}' as the label content`, () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (
    fieldName
  ) => {
    it("assigns an id that matches the label id", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (
    fieldName,
    existing
  ) => {
    it("saves existing value when submitted", async () => {
      const appointment = { [fieldName]: existing };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          onSave={() => { }}
        />
      );
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject(appointment);
    });
  };

  const itSubmitsNewValue = (fieldName, newValue) => {
    it("saves new value when submitted", async () => {
      render(
        <AppointmentForm
          {...testProps}
          original={blankAppointment}
          onSave={() => { }}
        />
      );
      change(field(fieldName), newValue);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: newValue
      });
    });
  };

  it("sends request to POST /appointments when submitting the form", async () => {
    render(
      <AppointmentForm
        {...testProps}
        onSave={() => { }}
      />
    );
    await clickAndWait(submitButton());
    expect(global.fetch).toBeCalledWith(
      "/appointments",
      expect.objectContaining({
        method: "POST",
      })
    );
  })

  it("calls fetch with the right configuration", async () => {
    render(
      <AppointmentForm
        {...testProps}
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

  it("notifies onSave when form is submitted", async () => {
    const appointment = {
      startsAt: availableTimeSlots[1].startsAt
    };
    global.fetch.mockResolvedValue(fetchResponseOk(appointment));
    const saveSpy = jest.fn();

    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={saveSpy}
      />
    );
    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalled();
  })

  it("renders an alert space", async () => {
    render(<AppointmentForm {...testProps} />);
    expect(element("[role=alert]")).not.toBeNull();
  })

  it("initially have no text in the alert space", async () => {
    render(<AppointmentForm {...testProps} />);
    expect(element("[role=alert]")).not.toContainText("error occurred");
  })

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue(fetchResponseError());
    })
    it("does not notify onSave", async () => {
      const saveSpy = jest.fn();

      render(
        <AppointmentForm
          {...testProps}
          onSave={saveSpy}
        />
      );
      await clickAndWait(submitButton());
      expect(saveSpy).not.toBeCalled();
    })
    it("renders error message", async () => {

      render(<AppointmentForm {...testProps} />);
      await clickAndWait(submitButton());

      expect(element("[role=alert]")).toContainText("error occurred");
    })
    it("error is cleared when the form is submitted with all validation errors corrected", async () => {
      global.fetch.mockResolvedValueOnce(
        fetchResponseError()
      );
      global.fetch.mockResolvedValue(fetchResponseOk());
      render(<AppointmentForm {...testProps} onSave={() => { }} />);
      await clickAndWait(submitButton());
      expect(element("[role=alert]")).toContainText("error occurred");
      await clickAndWait(submitButton());
      expect(element("[role=alert]")).not.toContainText("error occurred");
    })
  });


  describe("service field", () => {
    itRendersAsASelectBox("service");
    itInitiallyHasABlankValueChosen("service");
    itPreselectsExistingValue("service", "Cut");
    itRendersALabel("service", "Salon service");
    itAssignsAnIdThatMatchesTheLabelId("service");
    itSubmitsExistingValue("service", "Cut");
    itSubmitsNewValue("service", "Blow-dry");

    it("lists all salon services", () => {
      render(
        <AppointmentForm
          {...testProps}
          selectableServices={services}
        />
      );

      expect(
        labelsOfAllOptions(field("service"))
      ).toEqual(expect.arrayContaining(services));
    });

  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itInitiallyHasABlankValueChosen("stylist");
    itPreselectsExistingValue("stylist", "Jo");
    itRendersALabel("stylist", "Stylist");
    itAssignsAnIdThatMatchesTheLabelId("stylist");
    itSubmitsExistingValue("stylist", "Jo");
    itSubmitsNewValue("stylist", "Jo");

    it("lists only stylists that can perform the selected service", () => {
      const selectableServices = ["1", "2"];
      const selectableStylists = ["A", "B", "C"];
      const serviceStylists = {
        1: ["A", "B"],
      };

      const appointment = { service: "1" };

      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      expect(
        labelsOfAllOptions(field("stylist"))
      ).toEqual(expect.arrayContaining(["A", "B"]));
    });
  });

  describe("time slot table", () => {

    it("renders a table for time slots with an id", () => {
      render(<AppointmentForm {...testProps} />);
      expect(
        element("table#time-slots")
      ).not.toBeNull();
    })

    it("renders a time slot for every half an hour between open and close times", () => {
      render(
        <AppointmentForm
          {...testProps}
          salonOpensAt={9}
          salonClosesAt={11}
        />
      );
      const timesOfDayHeadings = elements("tbody >* th");
      expect(timesOfDayHeadings[0]).toContainText("09:00");
      expect(timesOfDayHeadings[1]).toContainText("09:30");
      expect(timesOfDayHeadings[3]).toContainText("10:30");
    });

    it("renders an empty cell at the strt of the header row", () => {
      render(<AppointmentForm {...testProps} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2018, 11, 1);
      render(
        <AppointmentForm
          {...testProps}
          today={specificDate}
        />
      );
      const dates = elements(
        "thead >* th:not(:first-child)"
      );
      expect(dates).toHaveLength(7);
      expect(dates[0]).toContainText("Sat 01");
      expect(dates[1]).toContainText("Sun 02");
      expect(dates[6]).toContainText("Fri 07");
    });
    const cellsWithRadioButtons = () =>
      elements("input[type=radio]").map((el) =>
        elements("td").indexOf(el.parentNode)
      );
    it("renders radio buttons in the correct table cell positions", () => {

      const availableTimeSlots = [
        { startsAt: todayAt(9) },
        { startsAt: todayAt(9, 30) },
        { startsAt: tomorrowAt(9, 30) },
      ];
      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );
      expect(cellsWithRadioButtons()).toEqual([0, 7, 8]);
    });

    it("does not render radio buttons for unavailable time slots", () => {
      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={[]}
        />
      );
      expect(
        elements("input[type=radio]")
      ).toHaveLength(0);
    });

    it("sets radio button values to the startsAt value of the corresponding appointment", () => {
      render(<AppointmentForm {...testProps} />);
      const allRadioValues = elements(
        "input[type=radio]"
      ).map(({ value }) => parseInt(value));
      const allSlotTimes = availableTimeSlots.map(
        ({ startsAt }) => startsAt
      );
      expect(allRadioValues).toEqual(allSlotTimes);
    });

    it("pre-selects the existing value", () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );
      expect(startsAtField(1).checked).toEqual(true);
    });

    it("filters appointments by selected stylist", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Jo"],
        },
      ];

      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );

      change(field("stylist"), "Jo");

      expect(cellsWithRadioButtons()).toEqual([7]);
    });
  });
});