const form = document.querySelector("[data-meeting-form]");
const steps = [...document.querySelectorAll("[data-form-step]")];
const progressSteps = [...document.querySelectorAll("[data-progress-step]")];
const progressBar = document.querySelector("[data-progress-bar]");
const progressValue = document.querySelector("[data-progress-value]");
const stepLabel = document.querySelector("[data-step-label]");
const formAlert = document.querySelector("[data-form-alert]");
const successState = document.querySelector("[data-success-state]");
const summarySubject = document.querySelector("[data-summary-subject]");
const summaryOrganization = document.querySelector("[data-summary-organization]");
const storageKey = "meterwise-kennismaking";

let currentStep = 0;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const showAlert = (message) => {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.hidden = !message;
};

const clearInvalidState = (field) => {
  field.classList.remove("is-invalid");
  field.closest(".consent")?.classList.remove("is-invalid");
};

const markInvalid = (field) => {
  field.classList.add("is-invalid");
  field.closest(".consent")?.classList.add("is-invalid");
};

const updateProgress = () => {
  const percentage = Math.round(((currentStep + 1) / steps.length) * 100);

  if (progressBar) progressBar.style.setProperty("--progress", `${percentage}%`);
  if (progressValue) progressValue.textContent = `${percentage}%`;
  if (stepLabel) stepLabel.textContent = `Stap ${currentStep + 1} van ${steps.length}`;

  progressSteps.forEach((item, index) => {
    item.classList.toggle("is-active", index === currentStep);
    item.classList.toggle("is-complete", index < currentStep);
    item.setAttribute("aria-current", index === currentStep ? "step" : "false");
  });
};

const showStep = (index, focusHeading = true) => {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, stepIndex) => {
    const isCurrent = stepIndex === currentStep;
    step.hidden = !isCurrent;
    step.classList.toggle("is-active", isCurrent);
  });

  showAlert("");
  updateProgress();
  saveDraft();

  if (focusHeading) {
    const legend = steps[currentStep].querySelector("legend");
    legend?.setAttribute("tabindex", "-1");
    legend?.focus({ preventScroll: true });
    document.querySelector(".form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const validateStep = (step) => {
  const requiredFields = [...step.querySelectorAll("[required]")];
  let firstInvalid = null;

  requiredFields.forEach((field) => clearInvalidState(field));

  const requiredRadioNames = [...new Set(
    requiredFields
      .filter((field) => field.type === "radio")
      .map((field) => field.name)
  )];

  requiredRadioNames.forEach((name) => {
    const group = [...step.querySelectorAll(`input[type="radio"][name="${name}"]`)];
    if (!group.some((radio) => radio.checked)) {
      group.forEach((radio) => markInvalid(radio));
      firstInvalid ||= group[0];
    }
  });

  requiredFields
    .filter((field) => field.type !== "radio")
    .forEach((field) => {
      if (!field.checkValidity()) {
        markInvalid(field);
        firstInvalid ||= field;
      }
    });

  if (firstInvalid) {
    showAlert("Controleer de gemarkeerde velden voordat je verdergaat.");
    firstInvalid.focus();
    return false;
  }

  showAlert("");
  return true;
};

const formValues = () => Object.fromEntries(new FormData(form).entries());

const updateSummary = () => {
  const values = formValues();
  if (summarySubject) summarySubject.textContent = values.onderwerp || "Nog geen onderwerp gekozen";
  if (summaryOrganization) {
    summaryOrganization.textContent = values.organisatie
      ? `${values.organisatie}${values.startmoment ? ` · ${values.startmoment}` : ""}`
      : "Organisatie nog niet ingevuld";
  }
};

function saveDraft() {
  if (!form) return;

  try {
    const values = formValues();
    delete values.toestemming;
    delete values.website;
    sessionStorage.setItem(storageKey, JSON.stringify({ values, currentStep }));
  } catch {
    // The form remains fully usable when storage is unavailable.
  }
}

const restoreDraft = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (!saved?.values) return;

    Object.entries(saved.values).forEach(([name, value]) => {
      const fields = [...form.elements].filter((field) => field.name === name);
      fields.forEach((field) => {
        if (field.type === "radio") field.checked = field.value === value;
        else if (field.type !== "checkbox") field.value = value;
      });
    });

    currentStep = Math.max(0, Math.min(Number(saved.currentStep) || 0, steps.length - 1));
  } catch {
    sessionStorage.removeItem(storageKey);
  }
};

const showSuccess = (message) => {
  steps.forEach((step) => { step.hidden = true; });
  document.querySelector(".form-progress").hidden = true;
  if (successState) {
    successState.hidden = false;
    const messageElement = successState.querySelector("[data-success-message]");
    if (messageElement) messageElement.textContent = message;
    successState.focus();
  }
  sessionStorage.removeItem(storageKey);
};

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (validateStep(steps[currentStep])) showStep(currentStep + 1);
  });
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showStep(currentStep - 1));
});

form.addEventListener("input", (event) => {
  clearInvalidState(event.target);
  showAlert("");
  updateSummary();
  saveDraft();
});

form.addEventListener("change", (event) => {
  clearInvalidState(event.target);
  updateSummary();
  saveDraft();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateStep(steps[currentStep])) return;

  const data = new FormData(form);
  if (data.get("website")) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "Aanvraag verwerken…";

  const endpoint = form.dataset.endpoint?.trim();

  try {
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });

      if (!response.ok) throw new Error("De formulierdienst kon de aanvraag niet verwerken.");

      showSuccess("Je aanvraag is verzonden. We nemen zo snel mogelijk persoonlijk contact met je op.");
      return;
    }

    const values = formValues();
    const subject = encodeURIComponent(`Kennismaking MeterWise – ${values.organisatie}`);
    const body = encodeURIComponent([
      `Onderwerp: ${values.onderwerp}`,
      `Organisatie: ${values.organisatie}`,
      `Omvang: ${values.omvang}`,
      `Gewenste start: ${values.startmoment}`,
      `Toelichting: ${values.toelichting || "Niet ingevuld"}`,
      "",
      `Naam: ${values.naam}`,
      `Functie: ${values.functie || "Niet ingevuld"}`,
      `E-mail: ${values.email}`,
      `Telefoon: ${values.telefoon || "Niet ingevuld"}`
    ].join("\n"));

    showSuccess("Je e-mailprogramma wordt geopend met de aanvraag alvast voor je ingevuld.");
    window.setTimeout(() => {
      window.location.href = `mailto:meterwise@outlook.com?subject=${subject}&body=${body}`;
    }, 250);
  } catch (error) {
    showAlert(error.message || "Er ging iets mis. Probeer het opnieuw of mail naar meterwise@outlook.com.");
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
  }
});

restoreDraft();
showStep(currentStep, false);
updateSummary();
