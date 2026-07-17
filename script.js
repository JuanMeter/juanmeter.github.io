const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const entry = document.querySelector(".entry");

function enterSite() {
  if (!document.body.classList.contains("has-entered")) {
    document.body.classList.add("has-entered");
    setTimeout(() => {
      if (entry) entry.setAttribute("aria-hidden", "true");
    }, 900);
  }
}

window.addEventListener("wheel", enterSite, { once: true, passive: true });
window.addEventListener("touchmove", enterSite, { once: true, passive: true });
window.addEventListener("keydown", (event) => {
  const keys = ["ArrowDown", "PageDown", " ", "Enter"];
  if (keys.includes(event.key)) enterSite();
}, { once: true });

setTimeout(() => {
  const hint = document.querySelector(".entry-hint");
  if (hint) hint.textContent = "Scroll, klik of druk op enter";
}, 2200);

if (entry) {
  entry.addEventListener("click", enterSite);
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entryItem) => {
      if (entryItem.isIntersecting) {
        entryItem.target.classList.add("is-visible");
        observer.unobserve(entryItem.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
