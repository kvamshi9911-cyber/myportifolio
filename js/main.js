/**
 * Portfolio Interactive Script
 * Author: Alex Morgan | Full-Stack Engineer & UI Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTypingEffect();
  initCounters();
  initSkillBars();
  initProjects();
  initTimelineTabs();
  initContactForm();
  initClipboardHelpers();
  initScrollTop();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });

  // Listen for OS preference change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-toggle-icon');
  if (!themeIcon) return;

  if (theme === 'light') {
    // Show Moon icon (for switching to dark)
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    themeToggleBtnLabel('Switch to dark mode');
  } else {
    // Show Sun icon (for switching to light)
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    themeToggleBtnLabel('Switch to light mode');
  }
}

function themeToggleBtnLabel(text) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.setAttribute('aria-label', text);
}

/* ==========================================================================
   2. Sticky Header, Mobile Navigation & Scrollspy
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active link check
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on navigation click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   3. Hero Rotating Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingTarget = document.getElementById('typing-role');
  if (!typingTarget) return;

  const roles = [
    'Senior Full-Stack Engineer',
    'UI/UX & Frontend Architect',
    'Cloud Systems Specialist',
    'Open Source Contributor'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Stats Animated Counters
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (!counterElements.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateNumber(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeProgress * target;

            counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              counter.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }

          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-container');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   5. Skill Meters Animation
   ========================================================================== */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (!skillFills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-level');
          fill.style.width = targetWidth + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) observer.observe(skillsSection);
}

/* ==========================================================================
   6. Projects Data, Filtering & Modal Dialog
   ========================================================================== */
const projectsData = [
  {
    id: 'nexus-ai',
    category: 'fullstack',
    title: 'Nexus AI Intelligence Platform',
    shortDesc: 'Enterprise AI analytics suite processing 5M+ daily events with sub-second vector search, predictive modeling, and live streaming metrics.',
    fullDesc: 'Nexus AI is a next-generation business intelligence dashboard delivering contextual insights using streaming LLM completions, real-time vector embeddings, and multi-tenant anomaly detection.',
    image: 'assets/project1.svg',
    tags: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Redis'],
    highlights: [
      'Sub-50ms query latency leveraging optimized Redis caching layers',
      'Interactive Canvas charts rendering 100,000+ data points smoothly at 60fps',
      'Automated semantic summarization pipeline powered by transformer models'
    ],
    liveUrl: 'https://example.com/nexus-ai',
    githubUrl: 'https://github.com/alexmorgan/nexus-ai-platform'
  },
  {
    id: 'lumina-shop',
    category: 'frontend',
    title: 'Lumina Luxury E-Commerce',
    shortDesc: 'High-converting headless storefront featuring instantaneous page loads, micro-interactions, responsive cart, and global localization.',
    fullDesc: 'A minimalist modern commerce platform built for high-end retail with edge-rendered catalog pages, smooth view transitions, predictive prefetching, and seamless Stripe integration.',
    image: 'assets/project2.svg',
    tags: ['Next.js', 'TailwindCSS', 'Stripe API', 'GraphQL', 'Web Vitals'],
    highlights: [
      '100/100 Core Web Vitals score across mobile and desktop audits',
      'Dynamic optimistic UI cart updates reducing user drop-off by 28%',
      'Fully keyboard-navigable and WCAG 2.1 AAA accessibility compliant'
    ],
    liveUrl: 'https://example.com/lumina-shop',
    githubUrl: 'https://github.com/alexmorgan/lumina-ecommerce'
  },
  {
    id: 'nova-pay',
    category: 'cloud',
    title: 'NovaPay Cross-Border FinTech',
    shortDesc: 'Mobile-first international payments and crypto-fiat settlement gateway with biometric security and bank-grade encryption.',
    fullDesc: 'A secure financial ecosystem enabling instant multi-currency transfers, automated tax reporting, and high-frequency ledger reconciliation on distributed cloud nodes.',
    image: 'assets/project3.svg',
    tags: ['Flutter', 'Go', 'gRPC', 'PostgreSQL', 'Docker', 'AWS'],
    highlights: [
      'PCI-DSS Level 1 compliant architecture with end-to-end tokenization',
      'Handles $15M+ monthly transaction volume across 40+ countries',
      'Resilient fault-tolerant microservices with 99.995% guaranteed uptime'
    ],
    liveUrl: 'https://example.com/nova-pay',
    githubUrl: 'https://github.com/alexmorgan/novapay-engine'
  },
  {
    id: 'orbit-ci',
    category: 'cloud',
    title: 'OrbitCI Cloud Automation Engine',
    shortDesc: 'Lightweight, lightning-fast containerized pipeline runner with smart caching, multi-cloud deployments, and live terminal streaming.',
    fullDesc: 'Designed to eliminate deployment bottlenecks, OrbitCI coordinates distributed build jobs across Kubernetes clusters with real-time log ingestion and slack notifications.',
    image: 'assets/project4.svg',
    tags: ['Go', 'Kubernetes', 'Docker', 'WebSockets', 'Terraform'],
    highlights: [
      'Cuts average pipeline build and test duration by 64% using layer deduplication',
      'Real-time bi-directional streaming terminal via WebSockets',
      'Infrastructure as Code (IaC) modular templates for AWS, GCP, and Azure'
    ],
    liveUrl: 'https://example.com/orbit-ci',
    githubUrl: 'https://github.com/alexmorgan/orbit-ci-runner'
  },
  {
    id: 'collab-canvas',
    category: 'fullstack',
    title: 'CollabCanvas Infinite Whiteboard',
    shortDesc: 'Real-time collaborative diagramming workspace supporting live multiplayer cursors, offline sync, and infinite vector canvas.',
    fullDesc: 'A collaborative tool for distributed engineering teams to design architectures, brainstorm system flows, and export SVG code in real time with conflict-free replicated data types (CRDTs).',
    image: 'assets/project5.svg',
    tags: ['TypeScript', 'WebGL', 'CRDTs', 'Node.js', 'Socket.io'],
    highlights: [
      'P2P state synchronization supporting up to 50 concurrent designers per board',
      'GPU-accelerated rendering utilizing WebGL for buttery 60 FPS panning/zooming',
      'Offline-first IndexedDB persistence with automatic conflict resolution'
    ],
    liveUrl: 'https://example.com/collab-canvas',
    githubUrl: 'https://github.com/alexmorgan/collab-canvas'
  },
  {
    id: 'atelier-ui',
    category: 'frontend',
    title: 'Atelier Modern Design System',
    shortDesc: 'Comprehensive accessible UI component library and design token engine adopted by 12,000+ developers globally.',
    fullDesc: 'Atelier provides 45+ headless, keyboard-friendly UI primitives with complete theme customization, token export for Figma, and automated visual regression testing.',
    image: 'assets/project6.svg',
    tags: ['CSS3', 'Web Components', 'TypeScript', 'Storybook', 'Jest'],
    highlights: [
      'Zero external dependencies with ultra-slim bundle (< 12KB gzipped)',
      'Native CSS Custom Properties integration with dynamic dark mode switching',
      'Comprehensive Storybook documentation and automated chromatic testing'
    ],
    liveUrl: 'https://example.com/atelier-ui',
    githubUrl: 'https://github.com/alexmorgan/atelier-design-system'
  }
];

function initProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('project-modal');

  if (!projectsGrid) return;

  // Render cards
  renderProjects(projectsData, projectsGrid);

  // Category filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const filteredData = filter === 'all' 
        ? projectsData 
        : projectsData.filter(item => item.category === filter);

      renderProjects(filteredData, projectsGrid);
    });
  });

  // Modal Setup
  initModal(modal);
}

function renderProjects(projects, container) {
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">No projects found in this category.</p>`;
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-id', project.id);

    card.innerHTML = `
      <div class="project-thumbnail">
        <img src="${project.image}" alt="${project.title} Preview" loading="lazy">
        <div class="project-overlay">
          <button class="btn btn-primary btn-sm view-details-btn" data-id="${project.id}">
            View Details
          </button>
        </div>
      </div>
      <div class="project-info">
        <span class="project-category">${project.category}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.shortDesc}</p>
        <div class="project-tags">
          ${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-actions">
          <button class="project-view-details view-details-btn" data-id="${project.id}">
            Case Study <span>→</span>
          </button>
          <div class="project-external-links">
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" aria-label="GitHub Repository">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn" aria-label="Live Demo Link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach modal triggers
  container.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openProjectModal(id);
    });
  });
}

function initModal(modal) {
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  // Close when clicking on backdrop
  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const project = projectsData.find(p => p.id === projectId);
  if (!modal || !project) return;

  document.getElementById('modal-img').src = project.image;
  document.getElementById('modal-category').textContent = project.category.toUpperCase();
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-overview').textContent = project.fullDesc;

  // Render highlights
  const highlightsList = document.getElementById('modal-features');
  highlightsList.innerHTML = project.highlights
    .map(h => `<li><span style="color:var(--accent-success);font-weight:bold;">✔</span> <span>${h}</span></li>`)
    .join('');

  // Render tags
  const tagsWrap = document.getElementById('modal-tags');
  tagsWrap.innerHTML = project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');

  // Update action links
  document.getElementById('modal-live-btn').href = project.liveUrl;
  document.getElementById('modal-github-btn').href = project.githubUrl;

  modal.showModal();
}

/* ==========================================================================
   7. Experience vs Education Timeline Tabs
   ========================================================================== */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab-btn');
  const expContainer = document.getElementById('timeline-experience');
  const eduContainer = document.getElementById('timeline-education');

  if (!tabs.length || !expContainer || !eduContainer) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      if (target === 'experience') {
        expContainer.style.display = 'block';
        eduContainer.style.display = 'none';
      } else {
        expContainer.style.display = 'none';
        eduContainer.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   8. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const msgInput = document.getElementById('contact-message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Reset error states
    document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'Please enter your name (minimum 2 characters)');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please provide a valid email address');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, 'Please provide a subject');
      isValid = false;
    }

    // Validate Message
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      setFieldError(msgInput, 'Please write a message with at least 10 characters');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      Sending Message...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      contactForm.reset();
      showToast('Thank you! Your message was sent successfully. I will get back to you shortly.', 'success');
    }, 800);
  });
}

function setFieldError(inputElem, msg) {
  const parent = inputElem.closest('.form-group');
  if (!parent) return;
  parent.classList.add('has-error');
  const errorMsgElem = parent.querySelector('.form-error-msg');
  if (errorMsgElem) {
    errorMsgElem.textContent = msg;
  }
}

/* ==========================================================================
   9. Quick Copy to Clipboard Helpers
   ========================================================================== */
function initClipboardHelpers() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied! ✓';
        btn.style.backgroundColor = 'var(--accent-success)';
        btn.style.borderColor = 'var(--accent-success)';
        btn.style.color = '#ffffff';

        showToast(`Copied "${textToCopy}" to clipboard!`, 'info');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });
}

/* ==========================================================================
   10. Scroll-to-Top Floating Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. Dynamic Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
