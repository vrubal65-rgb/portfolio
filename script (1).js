/* =========================================================
   script.js — Chetna Ghorela Portfolio
   1. Theme toggle        2. Mobile menu       3. Navbar scroll + active link
   4. Typing animation    5. Scroll reveal     6. Back-to-top
   7. Particle network    8. Certificate links   9. Footer year
   ========================================================= */

"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. THEME TOGGLE ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("theme", theme); } catch (e) { /* storage may be blocked */ }
}

let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ---------- 2. MOBILE MENU ---------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
  hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- 3. NAVBAR SCROLL + ACTIVE LINK ---------- */
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");

function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
  toTop.classList.toggle("show", window.scrollY > 500);

  let current = "home";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}

/* ---------- 4. TYPING ANIMATION ---------- */
const phrases = [
  "Exploring Artificial Intelligence",
  "Building Intelligent Solutions",
  "Creating Digital Experiences",
];
const typingEl = document.getElementById("typing-text");
let phraseIndex = 0, charIndex = 0, deleting = false;

function type() {
  const phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  typingEl.textContent = phrase.slice(0, charIndex);

  let delay = deleting ? 35 : 75;
  if (!deleting && charIndex === phrase.length) { deleting = true; delay = 1600; }
  else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}

if (prefersReducedMotion) typingEl.textContent = phrases[0];
else type();

/* ---------- 5. SCROLL REVEAL (+ skill bars) ---------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".skill").forEach((skill) => {
      skill.querySelector(".fill").style.width = skill.dataset.level + "%";
    });
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- 6. BACK TO TOP ---------- */
const toTop = document.getElementById("to-top");
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 7. PARTICLE NETWORK BACKGROUND ---------- */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let rafId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getComputedStyle(root).getPropertyValue("--canvas-color").trim();

  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, 0.7)`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${color}, ${0.18 * (1 - dist / 130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  rafId = requestAnimationFrame(drawNetwork);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!prefersReducedMotion) {
  drawNetwork();
  // Save battery: pause drawing while the tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else drawNetwork();
  });
}

/* ---------- 8. CERTIFICATE LINKS ---------- */
// Adds a "View credential" link to a card only when data-link has a real URL.
document.querySelectorAll(".cert").forEach((card) => {
  const url = (card.dataset.link || "").trim();
  if (!url.startsWith("https://")) return;
  const a = document.createElement("a");
  a.href = url;
  a.textContent = "View credential ↗";
  a.className = "cert-link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  card.appendChild(a);
});

/* ---------- 9. FOOTER YEAR ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
