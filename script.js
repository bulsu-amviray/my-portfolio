/* ============ CONFIG: change this ============ */
const CONTACT_EMAIL = "[EMAIL_ADDRESS]";

/* ============ FOOTER YEAR ============ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============ THEME TOGGLE ============ */
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function syncThemeButton() {
  const dark = root.getAttribute("data-theme") === "dark";
  themeBtn.setAttribute("aria-pressed", String(dark));
  themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}
themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next); // remember the choice
  syncThemeButton();
});
syncThemeButton();

/* ============ PROJECT FILTER ============ */
const filterBtns = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
const emptyMsg = document.getElementById("empty-msg");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    let visible = 0;
    cards.forEach((c) => {
      const show = f === "all" || c.dataset.category === f;
      c.hidden = !show;
      if (show) {
        visible++;
        // Soft filter entrance animation
        c.classList.remove("filter-anim");
        void c.offsetWidth; // trigger reflow
        c.classList.add("filter-anim");
      }
    });
    emptyMsg.hidden = visible > 0;
  });
});

/* ============ SCROLL REVEAL ============ */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(
    ".section h2, .filters, .card, .about-grid > div, .contact-grid > div, #contact-form"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

/* ============ CONTACT FORM ============ */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

function setError(input, msg) {
  document.getElementById(input.id + "-error").textContent = msg;
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

function validate() {
  const { name, email, message } = form.elements;
  const results = [
    setError(name, name.value.trim().length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    setError(email, !email.value.trim() ? "Please enter your email address."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "That doesn't look like a valid email (e.g. name@example.com)." : ""),
    setError(message, message.value.trim().length < 10 ? "Please write a message of at least 10 characters." : ""),
  ];
  if (results.includes(false)) {
    [name, email, message].find((i) => i.getAttribute("aria-invalid") === "true").focus();
    return false;
  }
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";
  if (!validate()) return;
  const subject = encodeURIComponent("Portfolio message from " + form.elements.name.value.trim());
  const body = encodeURIComponent(form.elements.message.value.trim() + "\n\n— " + form.elements.name.value.trim() + " (" + form.elements.email.value.trim() + ")");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  status.textContent = "Opening your email app…";
});

// Clear an error as soon as the user fixes the field
form.querySelectorAll("input, textarea").forEach((el) =>
  el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") setError(el, ""); })
);
