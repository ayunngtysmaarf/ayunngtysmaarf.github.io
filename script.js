document.documentElement.classList.add("js");

const languageToggle = document.querySelector("[data-language-toggle]");
const flags = { id: "assets/flag-id.svg", en: "assets/flag-gb.svg" };
const translatedElements = document.querySelectorAll("[data-id][data-en]");
const salesFacts = document.querySelectorAll(".sales-fact");
const rotatingCapability = document.getElementById("rotating-capability");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");
let currentLanguage = "id";
let capabilityIndex = 0;
const capabilities = {
  id: ["Operasional Retail", "Koordinasi Tim", "Sales & Customer Experience", "Inventaris & Administrasi", "Omnichannel Retail", "Data & Tools"],
  en: ["Retail Operations", "Team Coordination", "Sales & Customer Experience", "Inventory & Administration", "Omnichannel Retail", "Data & Tools"]
};

function animateCount(element, target) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = Number(element.textContent.replace(/,/g, "")) || 0;

  if (reduceMotion) {
    element.textContent = target.toLocaleString("en-US");
    return;
  }

  const startTime = performance.now();
  const duration = 650;

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(start + (target - start) * eased).toLocaleString("en-US");
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function setLanguage(language) {
  const isEnglish = language === "en";
  currentLanguage = language;

  document.documentElement.lang = language;
  document.title = isEnglish
    ? "Ayuningtyas Maarif — Portfolio"
    : "Ayuningtyas Maarif — Portofolio";

  translatedElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageToggle.classList.remove("flipping");
  void languageToggle.offsetWidth;
  languageToggle.classList.add("flipping");
  languageToggle.querySelector(".flag").src = flags[language];
  languageToggle.setAttribute("aria-label", languageToggle.dataset[`label${isEnglish ? "En" : "Id"}`]);

  rotatingCapability.textContent = capabilities[currentLanguage][capabilityIndex];
  const menuOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-label", menuOpen
    ? (isEnglish ? "Close menu" : "Tutup menu")
    : menuToggle.dataset[`label${isEnglish ? "En" : "Id"}`]);

  localStorage.setItem("portfolio-language", language);
}

languageToggle.addEventListener("click", () => setLanguage(currentLanguage === "id" ? "en" : "id"));

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  const labelKey = currentLanguage === "en" ? "En" : "Id";
  menuToggle.setAttribute("aria-label", open
    ? (currentLanguage === "en" ? "Close menu" : "Tutup menu")
    : menuToggle.dataset[`label${labelKey}`]);
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

primaryNavigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 640) setMenu(false);
});

const factObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target.querySelector(".counter");
    counter.textContent = "0";
    animateCount(counter, Number(entry.target.dataset.count));
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });

salesFacts.forEach((card) => factObserver.observe(card));

const revealGroups = [
  [".section-label", "left"],
  [".profile-grid > *", "up"],
  [".section-heading-row > *", "up"],
  [".experience-item", "up"],
  [".earlier-work", "up"],
  [".expertise-layout > h2", "left"],
  [".expertise-list > div", "up"],
  [".featured-work", "scale"],
  [".work-list article", "up"],
  [".education-layout > *", "up"],
  [".community-banner > *", "up"],
  [".contact > *", "up"]
];

revealGroups.forEach(([selector, direction]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.reveal = direction;
    element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { rootMargin: "0px 0px -10%", threshold: 0.08 });

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

let scrollFrame;
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.body.style.setProperty("--scroll-progress", `${progress}%`);
  scrollFrame = null;
}

window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
}, { passive: true });

updateScrollProgress();

function rotateCapability() {
  rotatingCapability.classList.add("is-changing");
  window.setTimeout(() => {
    capabilityIndex = (capabilityIndex + 1) % capabilities[currentLanguage].length;
    rotatingCapability.textContent = capabilities[currentLanguage][capabilityIndex];
    rotatingCapability.classList.remove("is-changing");
  }, 250);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(rotateCapability, 2400);
}

window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 24);
}, { passive: true });

const savedLanguage = localStorage.getItem("portfolio-language");
if (savedLanguage === "en") setLanguage("en");

document.getElementById("year").textContent = new Date().getFullYear();
