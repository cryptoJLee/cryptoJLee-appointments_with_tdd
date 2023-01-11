import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";
import { sampleAppointments } from "./sampleData";

const today = new Date();
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  // <CustomerForm original={{
  //   firstName: "Ashley",
  //   lastName: "Jamie",
  //   phoneNumber: "123456",
  // }} />
  <AppointmentForm
    original={{
      service: "",
      startsAt: today.setHours(9, 30, 0, 0)
    }}
    availableTimeSlots={[
      { startsAt: today.setHours(9, 0, 0, 0) },
      { startsAt: today.setHours(9, 30, 0, 0) },
    ]}
    today={today}
  />
);