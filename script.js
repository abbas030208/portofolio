/**
 * Portfolio Futuristik - JavaScript (Final)
 * ✅ Gabungan asli + perbaikan navbar mobile
 */

class PortfolioFuturistik {
  constructor() {
    this.init();
  }

  init() {
    this.setupAnimations();
    this.setupIntersectionObserver();
    this.setupNavigation();
    this.setupActiveSectionDetection();
    this.setupMagneticEffects();
    this.setupTiltEffects();
    this.setupParallax();
    this.setupSkillBars();
    this.setupPerformanceMonitoring();
    this.setupThemeToggle();
    this.setupProjectButtons();
    this.setupDownloadTracking();
  }

  setupAnimations() {
    this.spring = (from, to, stiffness = 240, damping = 26) => ({
      type: "spring",
      from,
      to,
      stiffness,
      damping,
    });

    this.tween = (from, to, duration = 0.7, easing = "easeOut") => ({
      type: "tween",
      from,
      to,
      duration,
      easing,
    });

    this.keyframes = (keyframes, duration = 3, iterationCount = "infinite") => ({
      type: "keyframes",
      keyframes,
      duration,
      iterationCount,
    });
  }

  setupIntersectionObserver() {
    const animationElements = document.querySelectorAll("[data-animation]");
    if (!animationElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            const parent = entry.target.parentElement;
            if (parent?.classList.contains("about-cards") || parent?.classList.contains("skills-grid") || parent?.classList.contains("project-grid")) {
              const index = Array.from(parent.children).indexOf(entry.target);
              entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    animationElements.forEach((el) => observer.observe(el));
  }

  setupNavigation() {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    const navBackdrop = document.querySelector(".nav-backdrop");
    const navClose = document.querySelector(".nav-close");
    const body = document.body;
    let previouslyFocusedElement = null;

    if (!navToggle || !nav) return;

    const toggleNav = () => {
      const isOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("nav-open", isOpen);
      navBackdrop?.classList.toggle("is-visible", isOpen);
      navToggle.classList.toggle("is-active", isOpen);
      nav.setAttribute("aria-hidden", String(!isOpen));

      if (isOpen) {
        previouslyFocusedElement = document.activeElement;
        const firstFocusable = nav.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus({ preventScroll: true });
      } else {
        if (previouslyFocusedElement && previouslyFocusedElement instanceof HTMLElement) {
          previouslyFocusedElement.focus({ preventScroll: true });
        } else {
          navToggle.focus({ preventScroll: true });
        }
      }

      // The hamburger to "X" animation will be handled by CSS using the .is-active class.
      // if (isOpen) {
      //   lines[0]?.setAttribute("style", "transform: rotate(45deg) translate(6px, 6px);");
      //   lines[1]?.setAttribute("style", "opacity: 0;");
      //   lines[2]?.setAttribute("style", "transform: rotate(-45deg) translate(6px, -6px);");
      // } else {
      //   lines.forEach((line) => line.removeAttribute("style"));
      // }
    };

    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    });

    navClose?.addEventListener("click", () => {
      toggleNav();
    });

    navBackdrop?.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        toggleNav();
      }
    });

    // Tutup menu saat link di klik (khusus mobile)
    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest(".nav-link")) {
        if (nav.classList.contains("is-open")) toggleNav();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggleNav();
      }
    });

    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
        toggleNav();
      }
    });

    // Focus trap saat menu terbuka
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      const focusables = nav.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  setupActiveSectionDetection() {
    const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    if (!links.length) return;

    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const section = document.getElementById(id);
      if (section) map.set(section, link);
    });

    const setActive = (link) => {
      links.forEach((l) => l.classList.toggle("is-active", l === link));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const link = map.get(visible[0].target);
          if (link) setActive(link);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    map.forEach((_, section) => observer.observe(section));
  }

  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll("[data-magnetic]");
    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.18;
        const radius = 140;

        if (Math.sqrt(x * x + y * y) < radius) {
          const moveX = x * strength;
          const moveY = y * strength;
          element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate(0px, 0px)";
      });
    });
  }

  setupTiltEffects() {
    const tiltElements = document.querySelectorAll("[data-tilt]");
    tiltElements.forEach((element) => {
      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll(".parallax");
    if (!parallaxElements.length) return;

    window.addEventListener(
      "scroll",
      () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        parallaxElements.forEach((element) => {
          element.style.transform = `translateY(${rate}px)`;
        });
      },
      { passive: true }
    );

    // Header shrink on scroll (optimized)
    const header = document.querySelector(".header");
    if (header) {
      let ticking = false;
      const onScroll = () => {
        const y = window.scrollY || window.pageYOffset;
        const shouldShrink = y > 16;
        header.classList.toggle("is-shrunk", shouldShrink);
        ticking = false;
      };

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
          }
        },
        { passive: true }
      );
      onScroll();
    }
  }

  setupSkillBars() {
    const skillBars = document.querySelectorAll(".skill-bar");
    if (!skillBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progress = Number(entry.target.getAttribute("data-progress")) || 0;
            const span = entry.target.querySelector("span");
            if (span) {
              span.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
  }

  setupPerformanceMonitoring() {
    if ("performance" in window) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType("navigation")[0];
          if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            if (loadTime > 3000) {
              console.warn("Page load time is slow:", loadTime + "ms");
            }
          }
        }, 0);
      });
    }
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector(".theme-toggle");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
    const rootEl = document.documentElement;

    const applyTheme = (theme) => {
      rootEl.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch (_) {}
    };

    (() => {
      let saved = null;
      try {
        saved = localStorage.getItem("portfolio-theme");
      } catch (_) {}
      const theme = saved || (prefersLight.matches ? "light" : "dark");
      applyTheme(theme);
    })();

    prefersLight.addEventListener?.("change", (e) => {
      const saved = localStorage.getItem("portfolio-theme");
      if (!saved) applyTheme(e.matches ? "light" : "dark");
    });

    themeToggle?.addEventListener("click", () => {
      const current = rootEl.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  setupProjectButtons() {
    const projectButtons = document.querySelectorAll(".project-actions .btn");
    projectButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const href = button.getAttribute("href");
        const buttonText = button.querySelector("span")?.textContent || "Button";
        const projectTitle = button.closest(".project-card")?.querySelector(".project-title")?.textContent || "Unknown Project";
        console.log(`Project Button Clicked: ${buttonText} - ${projectTitle} - ${href}`);
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
          button.style.transform = "";
        }, 150);
      });
    });
  }

  setupDownloadTracking() {
    const downloadButtons = document.querySelectorAll("a[download]");
    downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const fileName = button.getAttribute("download") || "CV";
        const href = button.getAttribute("href");
        console.log(`CV Download Started: ${fileName} - ${href}`);
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
          button.style.transform = "";
        }, 150);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioFuturistik();
});

window.addEventListener("load", () => {
  document.body.classList.remove("loading");
  const heroElements = document.querySelectorAll("#hero [data-animation]");
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("is-visible");
    }, index * 100);
  });
});

document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("page-hidden", document.hidden);
});

let resizeTimeout;
window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:resize"));
    }, 250);
  },
  { passive: true }
);
const form = document.querySelector('form[action*="formspree"]');
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  })
    .then(() => {
      alert("Pesan terkirim! Terima kasih.");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    })
    .catch(() => {
      alert("Gagal kirim. Coba lagi.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
});
window.PortfolioFuturistik = PortfolioFuturistik;