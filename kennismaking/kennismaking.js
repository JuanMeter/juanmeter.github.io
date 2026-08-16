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

const showAlert = (message, actionHref = "", actionLabel = "") => {
  if (!formAlert) return;
  formAlert.replaceChildren();
  if (message) formAlert.append(document.createTextNode(message));

  if (message && actionHref && actionLabel) {
    const action = document.createElement("a");
    action.href = actionHref;
    action.textContent = actionLabel;
    formAlert.append(document.createTextNode(" "), action);
  }

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
    delete values._gotcha;
    delete values._subject;
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

const applySubjectFromQuery = () => {
  const requestedSubject = new URLSearchParams(window.location.search).get("onderwerp");
  const subjectMap = {
    "governance-scan": "AI Governance Scan",
    quickscan: "AI QuickScan",
    "governance-program": "AI Governance Program",
    implementatie: "AI Governance Program",
    "iso-readiness": "AI Governance Program"
  };
  const subject = subjectMap[requestedSubject];
  if (!subject) return;

  const matchingRadio = [...form.querySelectorAll('input[name="onderwerp"]')]
    .find((field) => field.value === subject);

  if (matchingRadio) {
    matchingRadio.checked = true;
    currentStep = 0;
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
  if (data.get("_gotcha")) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "Aanvraag verzenden…";

  const endpoint = form.dataset.endpoint?.trim();
  const isConfigured = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint);

  if (!isConfigured) {
    showAlert(
      "Online verzenden is nog niet gekoppeld. De aanvraag is niet verstuurd.",
      "/contact/",
      "Ga naar contact."
    );
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const providerMessage = Array.isArray(result.errors)
        ? result.errors.map((item) => item.message).filter(Boolean).join(" ")
        : "";
      throw new Error(providerMessage || "De formulierdienst kon de aanvraag niet verwerken.");
    }

    showSuccess("Je aanvraag is via de website verzonden. We nemen persoonlijk contact met je op.");
  } catch (error) {
    showAlert(
      error.message || "Er ging iets mis bij het verzenden. Probeer het opnieuw.",
      "/contact/",
      "Ga naar contact."
    );
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
  }
});

restoreDraft();
applySubjectFromQuery();
showStep(currentStep, false);
updateSummary();
