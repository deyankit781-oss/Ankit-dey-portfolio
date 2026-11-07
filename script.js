/* =========================================================
   Portfolio interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* Mark the document so CSS can hide reveal elements only when JS is active */
  document.documentElement.classList.add("js");

  initMobileNav();
  initNavbarScrollState();
  initActiveNavLinks();
  initScrollReveal();
  initContactForm();
  initFooterYear();
});

/* ---------------------------------------------------------
   1. Mobile navigation
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const setMenuState = (isOpen) => {
    menu.classList.toggle("open", isOpen);
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  };

  toggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("open"));
  });

  /* Close the menu when any link inside it is tapped */
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  /* Close with the Escape key */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      setMenuState(false);
      toggle.focus();
    }
  });

  /* Reset the menu if the viewport grows past the mobile breakpoint */
  window
    .matchMedia("(min-width: 861px)")
    .addEventListener("change", (event) => {
      if (event.matches) setMenuState(false);
    });
}

/* ---------------------------------------------------------
   2. Navbar background when scrolled
   --------------------------------------------------------- */
function initNavbarScrollState() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();
}

/* ---------------------------------------------------------
   3. Highlight the nav link for the section in view
   --------------------------------------------------------- */
function initActiveNavLinks() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   4. Scroll reveal animations
   --------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  /* Fallback for very old browsers: show everything */
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); /* animate once */
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   5. Contact form validation and mailto submission
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const note = document.getElementById("formNote");
  const fields = {
    name: {
      input: form.elements["name"],
      error: document.getElementById("nameError"),
      validate: (value) => {
        if (!value) return "Please enter your name.";
        if (value.length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      input: form.elements["email"],
      error: document.getElementById("emailError"),
      validate: (value) => {
        if (!value) return "Please enter your email address.";
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(value)) return "Please enter a valid email address.";
        return "";
      },
    },
    message: {
      input: form.elements["message"],
      error: document.getElementById("messageError"),
      validate: (value) => {
        if (!value) return "Please write a message.";
        if (value.length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  const setFieldError = (fieldName, message) => {
    const field = fields[fieldName];
    const wrapper = field.input.closest(".form-group");
    field.error.textContent = message;
    wrapper.classList.toggle("invalid", Boolean(message));
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
  };

  /* Validate on blur, and clear errors while typing once a field is valid */
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];

    field.input.addEventListener("blur", () => {
      setFieldError(fieldName, field.validate(field.input.value.trim()));
    });

    field.input.addEventListener("input", () => {
      if (field.error.textContent) {
        setFieldError(fieldName, field.validate(field.input.value.trim()));
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const message = field.validate(field.input.value.trim());
      setFieldError(fieldName, message);

      if (message) {
        isValid = false;
        if (!firstInvalid) firstInvalid = field.input;
      }
    });

    if (!isValid) {
      note.textContent = "Please fix the highlighted fields.";
      firstInvalid.focus();
      return;
    }

    /* Open the visitor's email app with the message pre-filled */
    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    const message = fields.message.input.value.trim();

    const recipient = "deyankit781@gmail.com"; /* <-- replace with your email */
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n—\nFrom: ${name}\nReply to: ${email}`,
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email app. Thank you for reaching out!";
    form.reset();
    Object.keys(fields).forEach((fieldName) => setFieldError(fieldName, ""));
  });
}

/* ---------------------------------------------------------
   6. Footer year
   --------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
