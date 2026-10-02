document.documentElement.classList.add("js");

const languageToggle = document.querySelector("[data-language-toggle]");
const flags = { id: "assets/flag-id.svg", en: "assets/flag-gb.svg", pirate: "assets/flag-pirate.svg" };
let cycle = ["id", "en"];
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

function caps() {
  const base = currentLanguage === "pirate" ? "en" : currentLanguage;
  return currentLanguage === "pirate" ? capabilities.en.map(toPirate) : capabilities[base];
}

function setLanguage(language) {
  currentLanguage = language;
  const isPirate = language === "pirate";
  const base = isPirate ? "en" : language;
  const isEnglish = base === "en";

  document.documentElement.lang = base;
  document.title = isEnglish
    ? "Ayuningtyas Maarif — Portfolio"
    : "Ayuningtyas Maarif — Portofolio";

  translatedElements.forEach((element) => {
    const text = element.dataset[base];
    element.textContent = isPirate ? toPirate(text) : text;
  });

  languageToggle.classList.remove("flipping");
  void languageToggle.offsetWidth;
  languageToggle.classList.add("flipping");
  languageToggle.querySelector(".flag").src = flags[language];
  languageToggle.setAttribute("aria-label", isPirate
    ? "Ganti bahasa / Change language"
    : languageToggle.dataset[`label${isEnglish ? "En" : "Id"}`]);

  rotatingCapability.textContent = caps()[capabilityIndex];
  const menuOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-label", menuOpen
    ? (isEnglish ? "Close menu" : "Tutup menu")
    : menuToggle.dataset[`label${isEnglish ? "En" : "Id"}`]);

  localStorage.setItem("portfolio-language", language);
}

// Flag cycles through unlocked languages; 5 rapid clicks unlock Pirate Speak
let flagClicks = 0, flagTimer;
languageToggle.addEventListener("click", () => {
  flagClicks++;
  clearTimeout(flagTimer);
  flagTimer = setTimeout(() => (flagClicks = 0), 800);
  if (flagClicks >= 5 && !cycle.includes("pirate")) {
    flagClicks = 0;
    cycle.push("pirate");
    confetti();
    setLanguage("pirate");
    return;
  }
  const next = cycle[(cycle.indexOf(currentLanguage) + 1) % cycle.length];
  setLanguage(next);
});

const pirateWords = {
  my: "me", "i'm": "I be", im: "I be", is: "be", are: "be", am: "be",
  you: "ye", your: "yer", "you're": "ye be", for: "fer", of: "o'",
  the: "th'", to: "t'", and: "n'", with: "wit'", friend: "matey",
  friends: "mateys", hello: "ahoy", yes: "aye", money: "doubloons",
  team: "crew", teams: "crews", work: "plunder", experience: "voyages"
};
function toPirate(text) {
  return text.replace(/[A-Za-z']+/g, (w) => {
    const hit = pirateWords[w.toLowerCase()];
    if (!hit) return w;
    return /^[A-Z]/.test(w) ? hit.charAt(0).toUpperCase() + hit.slice(1) : hit;
  }).replace(/\.(\s|$)/g, ", arr!$1");
}

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
    capabilityIndex = (capabilityIndex + 1) % caps().length;
    rotatingCapability.textContent = caps()[capabilityIndex];
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

/* ---------- Easter eggs ---------- */
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Console greeting for the curious devs / recruiters
console.log(
  "%cAyuningtyas Maarif%c\nLiked the code? Let's talk → ayuningtyas.maarif99@gmail.com\nPsst… try the Konami code, or triple-click my name.",
  "font-size:20px;font-weight:700;color:#a8432e",
  "font-size:12px;color:#69665f"
);

// 2. Confetti burst (no deps)
function confetti() {
  if (reduceMotion()) return;
  const colors = ["#a8432e", "#ce1126", "#012169", "#20201d", "#e7dfd2"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("span");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.3 + "s";
    p.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

// 3. Konami code → confetti + party class
const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiPos = 0;
document.addEventListener("keydown", (event) => {
  konamiPos = event.key === konami[konamiPos] ? konamiPos + 1 : (event.key === konami[0] ? 1 : 0);
  if (konamiPos === konami.length) {
    konamiPos = 0;
    confetti();
    document.body.classList.toggle("party");
  }
});

// 4. Triple-click helper
function onTripleClick(element, callback) {
  let clicks = 0, timer;
  element.addEventListener("click", () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => (clicks = 0), 600);
    if (clicks >= 3) { clicks = 0; callback(); }
  });
}

// Triple-click the name → confetti
onTripleClick(document.getElementById("hero-title"), confetti);

// Triple-click the portrait → spin + confetti
const portrait = document.querySelector(".portrait-placeholder");
onTripleClick(portrait, () => {
  confetti();
  if (reduceMotion()) return;
  portrait.classList.remove("spin");
  void portrait.offsetWidth;
  portrait.classList.add("spin");
});
