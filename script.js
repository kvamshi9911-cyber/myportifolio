/**
 * ============================================================================
 * KARUMANCHI VAMSHI — ADVANCED PORTFOLIO SCRIPTS
 * Strictly Vanilla JavaScript: Theme Management, Animations, Validation & A11y
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. USER CONFIGURATION SETTINGS
   ============================================================================
   Replace the placeholder URLs below with your actual URLs.
   Leaving project URLs as empty strings will automatically trigger a clean
   "Coming Soon" notification instead of broken links.
   ============================================================================ */
const PORTFOLIO_CONFIG = {
  fullName: "Karumanchi Vamshi",
  
  // Rotating professional titles for hero section
  roles: [
    "Full Stack Python Developer",
    "Frontend Developer",
    "Backend Developer"
  ],

  // Direct contact credentials
  email: "kvamshi9911@gmail.com",
  phone: "+91 8919357140",
  whatsappUrl: "https://wa.me/918919357140",
  callUrl: "tel:+918919357140",

  // --------------------------------------------------------------------------
  // SOCIAL PROFILE URLS (Configure your profile URLs here)
  // --------------------------------------------------------------------------
  linkedinUrl: "https://www.linkedin.com/in/karumanchi-vamshi", // Replace with your LinkedIn URL
  githubUrl: "https://github.com/kvamshi9911-cyber",           // GitHub Profile URL

  // --------------------------------------------------------------------------
  // FEATURED PROJECT URLS (Set to empty string "" for "Coming Soon" status)
  // --------------------------------------------------------------------------
  projects: {
    project1: {
      title: "Responsive Static Website",
      liveUrl: "", // e.g. "https://your-domain.com/static-site" (empty = Coming Soon)
      repoUrl: ""  // e.g. "https://github.com/your-username/responsive-site"
    },
    project2: {
      title: "E-Commerce Website",
      liveUrl: "", // e.g. "https://your-domain.com/ecommerce" (empty = Coming Soon)
      repoUrl: ""  // e.g. "https://github.com/your-username/ecommerce-frontend"
    }
  }
};

/* ============================================================================
   2. DOM ELEMENT CACHE
   ============================================================================ */
const DOM = {
  html: document.documentElement,
  navbar: document.getElementById('navbar'),
  navLinks: document.querySelectorAll('.nav-link'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  mobileDrawer: document.getElementById('mobileDrawer'),
  scrollProgressBar: document.getElementById('scrollProgressBar'),
  cursorGlow: document.getElementById('cursorGlow'),
  typedText: document.getElementById('typedText'),
  profileTiltCard: document.getElementById('profileTiltCard'),
  resumeDownloadBtn: document.getElementById('resumeDownloadBtn'),
  resumeModal: document.getElementById('resumeModal'),
  closeResumeModalBtn: document.getElementById('closeResumeModalBtn'),
  toastContainer: document.getElementById('toastContainer'),
  backToTopBtn: document.getElementById('backToTopBtn'),
  currentYear: document.getElementById('currentYear'),
  contactForm: document.getElementById('contactForm'),
  projectLiveBtns: document.querySelectorAll('.project-live-btn'),
  projectRepoBtns: document.querySelectorAll('.project-repo-btn'),
  linkedinLinks: document.querySelectorAll('.linkedin-link'),
  githubLinks: document.querySelectorAll('.github-link')
};

/* ============================================================================
   3. THEME MANAGEMENT (Light / Dark Mode with System Preference & Persistence)
   ============================================================================ */
const ThemeManager = {
  STORAGE_KEY: 'vamshi_portfolio_theme',

  init() {
    // 1. Check local storage or system preference
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');

    this.applyTheme(initialTheme, false);

    // 2. Set up toggle listener
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = DOM.html.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme, true);
        
        ToastManager.show(
          `Switched to ${nextTheme === 'dark' ? 'Midnight Blue Dark' : 'Alice Blue Light'} mode`, 
          nextTheme === 'dark' ? '🌙' : '☀️', 
          2500
        );
      });
    }

    // 3. Listen to system preference changes if user hasn't explicitly set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });

    // 4. Sync theme across browser tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        this.applyTheme(e.newValue, false);
      }
    });
  },

  applyTheme(theme, saveToStorage = true) {
    DOM.html.setAttribute('data-theme', theme);
    if (saveToStorage) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }
};

/* ============================================================================
   4. ANIMATED TYPING EFFECT (Rotating Roles)
   ============================================================================ */
const TypingEffect = {
  roles: PORTFOLIO_CONFIG.roles,
  currentRoleIndex: 0,
  currentCharIndex: 0,
  isDeleting: false,
  typingSpeed: 90,
  deletingSpeed: 45,
  pauseDelay: 1800,
  nextRoleDelay: 400,

  init() {
    if (!DOM.typedText || !this.roles.length) return;
    this.tick();
  },

  tick() {
    const fullText = this.roles[this.currentRoleIndex];

    if (this.isDeleting) {
      // Deleting characters
      this.currentCharIndex--;
      DOM.typedText.textContent = fullText.substring(0, this.currentCharIndex);
    } else {
      // Typing characters
      this.currentCharIndex++;
      DOM.typedText.textContent = fullText.substring(0, this.currentCharIndex);
    }

    let nextTimeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    // Word completed
    if (!this.isDeleting && this.currentCharIndex === fullText.length) {
      this.isDeleting = true;
      nextTimeout = this.pauseDelay;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      nextTimeout = this.nextRoleDelay;
    }

    setTimeout(() => this.tick(), nextTimeout);
  }
};

/* ============================================================================
   5. NAVIGATION & ACTIVE SECTION HIGHLIGHTING (IntersectionObserver)
   ============================================================================ */
const NavigationManager = {
  init() {
    this.initMobileMenu();
    this.initActiveScrollObserver();
    this.initSmoothScroll();
  },

  initMobileMenu() {
    if (!DOM.mobileMenuBtn || !DOM.mobileDrawer) return;

    const toggleMenu = () => {
      const isOpen = DOM.mobileDrawer.classList.toggle('open');
      DOM.mobileMenuBtn.classList.toggle('active', isOpen);
      DOM.mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      DOM.mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
      DOM.mobileDrawer.classList.remove('open');
      DOM.mobileMenuBtn.classList.remove('active');
      DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    DOM.mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close when clicking any mobile link
    DOM.mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  },

  initActiveScrollObserver() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

/* ============================================================================
   6. SCROLL PROGRESS & BACK TO TOP BUTTON
   ============================================================================ */
const ScrollManager = {
  init() {
    window.addEventListener('scroll', () => {
      this.updateProgressBar();
      this.updateBackToTopButton();
    }, { passive: true });

    if (DOM.backToTopBtn) {
      DOM.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  },

  updateProgressBar() {
    if (!DOM.scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    DOM.scrollProgressBar.style.width = `${scrollPercent}%`;
  },

  updateBackToTopButton() {
    if (!DOM.backToTopBtn) return;
    if (window.scrollY > 400) {
      DOM.backToTopBtn.classList.add('visible');
    } else {
      DOM.backToTopBtn.classList.remove('visible');
    }
  }
};

/* ============================================================================
   7. INTERACTIVE 3D CARD TILT (Desktop fine pointers only)
   ============================================================================ */
const CardTiltManager = {
  init() {
    // Only apply on fine-pointer devices and when reduced motion is NOT preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !isFinePointer || !DOM.profileTiltCard) return;

    const card = DOM.profileTiltCard;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
};

/* ============================================================================
   8. DESKTOP AMBIENT CURSOR GLOW
   ============================================================================ */
const CursorGlowManager = {
  init() {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion || !DOM.cursorGlow) return;

    let mouseX = -100;
    let mouseY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      DOM.cursorGlow.style.left = `${mouseX}px`;
      DOM.cursorGlow.style.top = `${mouseY}px`;
    }, { passive: true });
  }
};

/* ============================================================================
   9. SCROLL REVEAL (IntersectionObserver)
   ============================================================================ */
const ScrollRevealManager = {
  init() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
};

/* ============================================================================
   10. TOAST NOTIFICATION SYSTEM
   ============================================================================ */
const ToastManager = {
  show(message, icon = 'ℹ️', duration = 3500) {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
};

/* ============================================================================
   11. RESUME DOWNLOAD GRACEFUL HANDLING
   ============================================================================ */
const ResumeManager = {
  init() {
    if (!DOM.resumeDownloadBtn) return;

    DOM.resumeDownloadBtn.addEventListener('click', (e) => {
      // Test if resume file is accessible
      fetch('assets/resume.pdf', { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            // File does not exist yet (404)
            e.preventDefault();
            this.showMissingModal();
          }
        })
        .catch(() => {
          // File fetch failed
          e.preventDefault();
          this.showMissingModal();
        });
    });

    if (DOM.closeResumeModalBtn && DOM.resumeModal) {
      DOM.closeResumeModalBtn.addEventListener('click', () => {
        DOM.resumeModal.classList.remove('open');
        DOM.resumeModal.setAttribute('aria-hidden', 'true');
      });

      DOM.resumeModal.addEventListener('click', (e) => {
        if (e.target === DOM.resumeModal) {
          DOM.resumeModal.classList.remove('open');
          DOM.resumeModal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  },

  showMissingModal() {
    if (!DOM.resumeModal) {
      ToastManager.show("Resume file 'assets/resume.pdf' has not been added yet.", "📄", 4000);
      return;
    }
    DOM.resumeModal.classList.add('open');
    DOM.resumeModal.setAttribute('aria-hidden', 'false');
  }
};

/* ============================================================================
   12. PROJECT & SOCIAL LINKS MANAGEMENT
   ============================================================================ */
const LinksManager = {
  init() {
    // 1. Configure LinkedIn Links
    DOM.linkedinLinks.forEach(link => {
      link.href = PORTFOLIO_CONFIG.linkedinUrl;
    });

    // 2. Configure GitHub Links
    DOM.githubLinks.forEach(link => {
      link.href = PORTFOLIO_CONFIG.githubUrl;
    });

    // 3. Configure Project Live Demo Buttons
    DOM.projectLiveBtns.forEach(btn => {
      const projectKey = btn.getAttribute('data-project');
      const project = PORTFOLIO_CONFIG.projects[projectKey];

      if (project && project.liveUrl && project.liveUrl.trim() !== '') {
        btn.href = project.liveUrl;
      } else {
        btn.href = '#';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          ToastManager.show(`Live Demo for "${project ? project.title : 'this project'}" is Coming Soon!`, '🚀', 3500);
        });
      }
    });

    // 4. Configure Project GitHub Repo Buttons
    DOM.projectRepoBtns.forEach(btn => {
      const projectKey = btn.getAttribute('data-project');
      const project = PORTFOLIO_CONFIG.projects[projectKey];

      if (project && project.repoUrl && project.repoUrl.trim() !== '') {
        btn.href = project.repoUrl;
      } else {
        btn.href = '#';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          ToastManager.show(`Repository for "${project ? project.title : 'this project'}" is Coming Soon!`, '📂', 3500);
        });
      }
    });
  }
};

/* ============================================================================
   13. CONTACT FORM VALIDATION & CLIENT-SIDE MAILTO DISPATCH
   ============================================================================ */
const ContactFormManager = {
  init() {
    if (!DOM.contactForm) return;

    DOM.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Clear validation error on input
    ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          const formGroup = input.closest('.form-group');
          if (formGroup) formGroup.classList.remove('has-error');
        });
      }
    });
  },

  handleFormSubmit() {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    let isValid = true;

    // Validate Name
    if (!name) {
      this.setError(nameInput, true);
      isValid = false;
    } else {
      this.setError(nameInput, false);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.setError(emailInput, true);
      isValid = false;
    } else {
      this.setError(emailInput, false);
    }

    // Validate Subject
    if (!subject) {
      this.setError(subjectInput, true);
      isValid = false;
    } else {
      this.setError(subjectInput, false);
    }

    // Validate Message
    if (!message) {
      this.setError(messageInput, true);
      isValid = false;
    } else {
      this.setError(messageInput, false);
    }

    if (!isValid) {
      ToastManager.show('Please fill in all required fields properly.', '⚠️', 3500);
      return;
    }

    // Construct Mailto Link
    const mailtoSubject = encodeURIComponent(`Portfolio Inquiry: ${subject} (from ${name})`);
    const mailtoBody = encodeURIComponent(
      `Hi Karumanchi Vamshi,\n\n` +
      `My Name: ${name}\n` +
      `My Email: ${email}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nSent via Karumanchi Vamshi Portfolio Website`
    );

    const mailtoUrl = `mailto:${PORTFOLIO_CONFIG.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Provide friendly, completely transparent feedback to the user
    ToastManager.show('Opening your email client to dispatch the message...', '✉️', 4500);

    // Open user's default email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  },

  setError(input, hasError) {
    if (!input) return;
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      if (hasError) {
        formGroup.classList.add('has-error');
      } else {
        formGroup.classList.remove('has-error');
      }
    }
  }
};

/* ============================================================================
   14. APPLICATION INITIALIZATION
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic copyright year
  if (DOM.currentYear) {
    DOM.currentYear.textContent = new Date().getFullYear();
  }

  // 2. Initialize Core Modules
  ThemeManager.init();
  TypingEffect.init();
  NavigationManager.init();
  ScrollManager.init();
  CardTiltManager.init();
  CursorGlowManager.init();
  ScrollRevealManager.init();
  ResumeManager.init();
  LinksManager.init();
  ContactFormManager.init();
});
