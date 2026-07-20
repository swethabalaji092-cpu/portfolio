const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;
const loader = document.getElementById("loader");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const scrollTopBtn = document.getElementById("scrollTop");
const typedText = document.getElementById("typedText");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const progressBars = document.querySelectorAll(".progress");
const animateItems = document.querySelectorAll("[data-animate]");

const theme = localStorage.getItem("portfolio-theme") || "dark";
html.setAttribute("data-theme", theme);
updateThemeIcon(theme);

function updateThemeIcon(currentTheme) {
  const icon = themeToggle.querySelector("i");
  icon.className = currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

themeToggle.addEventListener("click", () => {
  const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeIcon(nextTheme);
});

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  setTimeout(() => {
    loader.style.display = "none";
  }, 400);
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("show", window.scrollY > 400);
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const typingWords = ["beautiful interfaces", "robust web apps", "data-driven experiences"];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentWord = typingWords[typingIndex];

  if (!isDeleting) {
    charIndex++;
    typedText.textContent = currentWord.slice(0, charIndex);
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedText.textContent = currentWord.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingWords.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 60 : 100);
}

typeLoop();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

animateItems.forEach((item) => observer.observe(item));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.5 }
);

progressBars.forEach((bar) => skillObserver.observe(bar));

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;

  const resetError = (fieldId) => {
    const field = document.getElementById(fieldId);
    const error = field.parentElement.querySelector(".error-message");
    error.textContent = "";
    field.style.borderColor = "";
  };

  const setError = (fieldId, messageText) => {
    const field = document.getElementById(fieldId);
    const error = field.parentElement.querySelector(".error-message");
    error.textContent = messageText;
    field.style.borderColor = "#ff8f8f";
    isValid = false;
  };

  resetError("name");
  resetError("email");
  resetError("message");

  if (name.length < 2) {
    setError("name", "Please enter your name.");
  }

  if (!validateEmail(email)) {
    setError("email", "Please enter a valid email address.");
  }

  if (message.length < 10) {
    setError("message", "Please write a brief message.");
  }

  if (!isValid) {
    formStatus.textContent = "Please fix the highlighted fields.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:alex.carter.dev@email.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Thanks! Your email app should open with the message ready to send.";
  contactForm.reset();
});

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function createParticles() {
  const count = Math.min(70, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 1,
    dx: Math.random() * 0.5 - 0.25,
    dy: Math.random() * 0.5 - 0.25,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.dx;
    particle.y += particle.dy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.dx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.dy *= -1;

    ctx.beginPath();
    ctx.fillStyle = "rgba(124, 156, 255, 0.8)";
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});
