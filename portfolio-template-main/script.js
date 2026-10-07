const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav-items");
const btnToggleNav = document.querySelector(".menu-btn");
const workEls = document.querySelectorAll(".work-box");
const workImgs = document.querySelectorAll(".work-img");
const mainEl = document.querySelector("main");
const yearEl = document.querySelector(".footer-text span");

const toggleNav = () => {
  nav.classList.toggle("hidden");

  // Prevent screen from scrolling when menu is opened
  document.body.classList.toggle("lock-screen");

  if (nav.classList.contains("hidden")) {
    btnToggleNav.textContent = "menu";
  } else {
    // When menu is opened after transition change text respectively
    setTimeout(() => {
      btnToggleNav.textContent = "close";
    }, 475);
  }
};

btnToggleNav.addEventListener("click", toggleNav);

navMenu.addEventListener("click", (e) => {
  if (e.target.localName === "a") {
    toggleNav();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.classList.contains("hidden")) {
    toggleNav();
  }
});

// Animating work instances on scroll

workImgs.forEach((workImg) => workImg.classList.add("transform"));

let observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    const [textbox, picture] = Array.from(entry.target.children);
    if (entry.isIntersecting) {
      picture.classList.remove("transform");
      Array.from(textbox.children).forEach(
        (el) => (el.style.animationPlayState = "running")
      );
    }
  },
  { threshold: 0.3 }
);

workEls.forEach((workEl) => {
  observer.observe(workEl);
});

// Toggle theme and store user preferred theme for future

const switchThemeEl = document.querySelector('input[type="checkbox"]');
const storedTheme = localStorage.getItem("theme");

switchThemeEl.checked = storedTheme === "dark" || storedTheme === null;

switchThemeEl.addEventListener("click", () => {
  const isChecked = switchThemeEl.checked;

  if (!isChecked) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
    switchThemeEl.checked = false;
  } else {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }
});

// Trap the tab when menu is opened

const lastFocusedEl = document.querySelector('a[data-focused="last-focused"]');

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && document.activeElement === lastFocusedEl) {
    e.preventDefault();
    btnToggleNav.focus();
  }
});

yearEl.textContent = new Date().getFullYear();

// Hero: typing effect for the coursework line

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const typedEl = document.getElementById("typed");
const pause = (ms) => new Promise((res) => setTimeout(res, ms));

if (typedEl && !reduceMotion) {
  const words = ["Computer Vision", "Web Development", "Cloud Computing"];
  (async () => {
    await pause(1800);
    let i = 0;
    while (true) {
      const word = words[i % words.length];
      for (let n = word.length; n >= 0; n--) {
        typedEl.textContent = word.slice(0, n);
        await pause(45);
      }
      i++;
      const next = words[i % words.length];
      await pause(250);
      for (let n = 1; n <= next.length; n++) {
        typedEl.textContent = next.slice(0, n);
        await pause(80);
      }
      await pause(2200);
    }
  })();
}

// Hero: subtle 3D tilt on the portrait (pointer devices only)

const stage = document.getElementById("photoStage");
const headerEl = document.querySelector(".header");

if (stage && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
  headerEl.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
    const y = (e.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
    stage.style.setProperty("--ry", `${x * 14}deg`);
    stage.style.setProperty("--rx", `${-y * 12}deg`);
  });
  headerEl.addEventListener("mouseleave", () => {
    stage.style.setProperty("--ry", "0deg");
    stage.style.setProperty("--rx", "0deg");
  });
}
