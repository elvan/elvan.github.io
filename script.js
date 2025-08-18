/**
 * Modern Portfolio - Interactive Functionality
 * Optimized for performance with efficient event handling and smooth animations
 */
// Accessibility & UX helpers
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loader
const pageLoader = qs('#pageLoader');
const hideLoader = () => {
  if (!pageLoader) return;
  pageLoader.style.opacity = '0';
  pageLoader.style.pointerEvents = 'none';
  setTimeout(() => pageLoader.remove(), 300);
};
window.addEventListener('load', () => prefersReducedMotion ? pageLoader.remove() : hideLoader());
document.addEventListener('DOMContentLoaded', () => {
  // Fallback hide in case load waits on slow images (we lazy load anyway)
  setTimeout(() => { if (pageLoader && document.readyState !== 'loading') hideLoader(); }, 1200);
});

// Theme toggle
function setTheme(useDark) {
  const html = document.documentElement;
  html.classList.toggle('dark', useDark);
  try {
    localStorage.setItem('theme', useDark ? 'dark' : 'light');
  } catch {}
  const icon = qs('#themeIcon'); const iconM = qs('#themeIconMobile');
  [icon, iconM].forEach(i => {
    if (!i) return;
    i.classList.toggle('fa-moon', !useDark);
    i.classList.toggle('fa-sun', useDark);
  });
  const themeMeta = qs('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = useDark ? '#0f172a' : '#ffffff';
}
function initThemeControls() {
  const stored = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored ? stored === 'dark' : prefersDark);

  const btn = qs('#themeToggle');
  const btnM = qs('#themeToggleMobile');
  const handle = () => setTheme(!document.documentElement.classList.contains('dark'));
  btn?.addEventListener('click', handle);
  btnM?.addEventListener('click', handle);
}

// Mobile menu
function initMobileMenu() {
  const btn = qs('#mobileMenuButton');
  const menu = qs('#mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
  // close on link click
  qsa('a[href^="#"]', menu).forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth anchor scroll with header offset
function initSmoothAnchors() {
  const header = document.querySelector('header');
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0);
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - (headerOffset() + 8);
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

// Scroll progress bar
function initScrollProgress() {
  const bar = qs('#scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, window.scrollY / (max || 1)));
    bar.style.width = (pct * 100) + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// Scroll to top
function initScrollTop() {
  const btn = qs('#scrollTopBtn');
  if (!btn) return;
  const toggle = () => {
    if (window.scrollY > 400) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Typing effect
function initTyping() {
  const el = qs('#typedText');
  if (!el) return;
  const phrases = [
    'Full‑Stack Developer',
    'Accessibility Advocate',
    'Performance Tuner',
    'Problem Solver',
    'UI Polisher'
  ];
  let pi = 0, ci = 0, deleting = false;
  const speed = () => (deleting ? 40 : 80);
  const pause = 1200;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        return setTimeout(tick, pause);
      }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, prefersReducedMotion ? 0 : speed());
  }
  tick();
}

// Reveal on scroll
function initRevealOnScroll() {
  const items = qsa('[data-reveal]');
  if (items.length === 0) return;
  items.forEach(el => {
    el.style.transition = prefersReducedMotion ? 'none' : 'all 500ms cubic-bezier(.21,1,.21,1)';
    el.style.transform = 'translateY(12px)';
    el.style.opacity = '0';
  });
  if (prefersReducedMotion) {
    items.forEach(el => { el.style.transform = 'none'; el.style.opacity = '1'; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'none';
        e.target.style.opacity = '1';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

// Skills progress bars
function initSkills() {
  const bars = qsa('.skill-bar');
  if (bars.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.getAttribute('data-width') || '0';
        e.target.style.transition = prefersReducedMotion ? 'none' : 'width 1s ease';
        requestAnimationFrame(() => e.target.style.width = `${w}%`);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

// Projects filter
function initProjectFilters() {
  const buttons = qsa('.filter-btn');
  const cards = qsa('.project-card');
  if (!buttons.length || !cards.length) return;

  function setActive(btn) {
    buttons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.classList.remove('bg-indigo-600', 'text-white');
      b.classList.add('border', 'border-slate-300', 'dark:border-slate-700');
    });
    btn.classList.add('active', 'bg-indigo-600', 'text-white');
    btn.classList.remove('border', 'border-slate-300', 'dark:border-slate-700');
    btn.setAttribute('aria-selected', 'true');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setActive(btn);
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const match = filter === 'all' || filter === category;
        if (match) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
          card.style.transform = 'none';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Lazy load images
function initLazyImages() {
  const imgs = qsa('img[data-src]');
  if (!imgs.length) return;
  const load = img => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  };
  if ('loading' in HTMLImageElement.prototype) {
    imgs.forEach(load);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        load(e.target);
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => io.observe(img));
}

// Current year
function setCurrentYear() {
  const y = new Date().getFullYear();
  const el = qs('#currentYear');
  if (el) el.textContent = String(y);
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initThemeControls();
  initMobileMenu();
  initSmoothAnchors();
  initScrollProgress();
  initScrollTop();
  initTyping();
  initRevealOnScroll();
  initSkills();
  initProjectFilters();
  initLazyImages();
  setCurrentYear();
});
class PortfolioApp {
  constructor() {
    this.nav = document.querySelector('nav');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navLinks = document.querySelector('.nav-links');
    this.sections = document.querySelectorAll('section[id]');
    this.scrollProgress = document.querySelector('.scroll-progress');
    this.scrollTopBtn = document.querySelector('.scroll-top');
    this.themeToggle = document.querySelector('.theme-toggle');
    this.typedTextSpan = document.querySelector('.typed-text');
    this.cursor = document.querySelector('.cursor');
    this.pageLoader = document.querySelector('#pageLoader');
    this.navAnchors = document.querySelectorAll('nav a[href^="#"]');

    // Configuration
    this.textArray = [
      'Full-Stack Developer',
      'Software Engineer',
      'Problem Solver',
      'Tech Enthusiast'
    ];
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    // Performance optimization flags
    this.isScrolling = false;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupProgressBarsObserver();
    this.setupLazyImageLoading();
    this.preloadCriticalResources();
    this.initializeTheme();
    this.initializeProjects();
    this.startTypingAnimation();
    this.initializePageLoader();
    this.updateCopyrightYear();
    this.initializeModernFeatures();

    // Initialize with home section visible
    const homeSection = document.querySelector('#home');
    if (homeSection) {
      homeSection.classList.add('section-visible');
    }

    console.log('Portfolio App initialized successfully');
  }

  initializeModernFeatures() {
    this.setupVisibilityChangeHandler();
    this.setupConnectionMonitoring();
    this.setupMemoryManagement();
    this.setupPreferredMotionHandling();
    this.setupViewTransitionAPI();
    this.setupMicroInteractions();
  }

  setupMicroInteractions() {
    this.setupMagneticHover();
    this.setupParallaxElements();
    this.setupRevealAnimations();
    this.addVisualEffectClasses();
  }

  setupMagneticHover() {
    // Add magnetic hover effect to buttons and cards
    const magneticElements = document.querySelectorAll('.cta-button, .hero-social a, .project-card, .contact-link');

    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.1;
        const moveY = y * 0.1;

        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
      });
    });
  }

  setupParallaxElements() {
    // Add subtle parallax effect to background elements
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    }, { passive: true });
  }

  setupRevealAnimations() {
    // Enhanced reveal animations for elements
    const revealElements = document.querySelectorAll('.stat-item, .filter-btn, .tech-tag');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(element);
    });
  }

  addVisualEffectClasses() {
    // Add modern effect classes to elements
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
      button.classList.add('cursor-glow', 'magnetic-hover');
    });

    const cards = document.querySelectorAll('.project-card, .experience-item, .skills-category');
    cards.forEach(card => {
      card.classList.add('tilt-hover');
    });

    const socialLinks = document.querySelectorAll('.hero-social a, .contact-link');
    socialLinks.forEach(link => {
      link.classList.add('glass-morphism', 'magnetic-hover');
    });
  }

  setupVisibilityChangeHandler() {
    // Pause animations and heavy operations when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause typing animation and other timers
        this.pauseAnimations();
      } else {
        // Resume animations
        this.resumeAnimations();
      }
    });
  }

  setupConnectionMonitoring() {
    // Monitor network connection for adaptive loading
    if ('connection' in navigator) {
      const connection = navigator.connection;

      const updateConnectionInfo = () => {
        const isSlowConnection = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
        document.documentElement.setAttribute('data-connection', connection.effectiveType);

        if (isSlowConnection) {
          // Disable some animations for slow connections
          document.documentElement.setAttribute('data-reduced-motion', 'true');
        }
      };

      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();
    }
  }

  setupMemoryManagement() {
    // Clean up observers and event listeners on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Monitor memory usage if API is available
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        if (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize > 0.8) {
          console.warn('High memory usage detected');
          this.performCleanup();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  setupPreferredMotionHandling() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
    };

    prefersReducedMotion.addEventListener('change', handleMotionPreference);
    handleMotionPreference(prefersReducedMotion);
  }

  setupViewTransitionAPI() {
    // Use View Transitions API if available
    if ('startViewTransition' in document) {
      this.viewTransitionsSupported = true;
      console.log('View Transitions API supported');
    }
  }

  pauseAnimations() {
    // Pause typing animation
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Pause other animations
    document.documentElement.style.animationPlayState = 'paused';
  }

  resumeAnimations() {
    // Resume typing animation
    if (this.typedTextSpan) {
      this.startTypingAnimation();
    }

    // Resume other animations
    document.documentElement.style.animationPlayState = 'running';
  }

  performCleanup() {
    // Clean up unnecessary DOM references
    this.cleanupDeadReferences();

    // Force garbage collection if possible
    if (window.gc) {
      window.gc();
    }
  }

  cleanupDeadReferences() {
    // Remove event listeners from removed elements
    const deadElements = document.querySelectorAll('[data-removed="true"]');
    deadElements.forEach(element => {
      element.remove();
    });
  }

  cleanup() {
    // Clean up all observers and timers
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Clean up intersection observers
    this.observers?.forEach(observer => observer.disconnect());
  }

  setupEventListeners() {
    // Mobile menu toggle
    this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => this.handleDocumentClick(e));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
    });

    // Throttled scroll handling
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Theme toggle
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());

    // Scroll to top button
    this.scrollTopBtn?.addEventListener('click', () => this.scrollToTop());

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Resize handling (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 250);
    }, { passive: true });

    // Enhanced focus handling for better keyboard navigation
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Prefetch hover states for better performance
    this.setupHoverPrefetch();

    // Enhanced accessibility event listeners
    this.setupAccessibilityEvents();
  }

  setupAccessibilityEvents() {
    // Skip link navigation
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Enhanced ARIA live region updates
    this.setupLiveRegionUpdates();

    // Focus trap for mobile menu
    this.setupFocusTrap();

    // Announce page changes for screen readers
    this.setupPageChangeAnnouncements();

    // Enhanced keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  setupLiveRegionUpdates() {
    // Create a dedicated live region for dynamic announcements
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }

  setupFocusTrap() {
    // Enhanced focus trap for mobile menu
    this.focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  }

  setupPageChangeAnnouncements() {
    // Announce section changes when navigating
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = this.getSectionName(entry.target.id);
          this.announceToScreenReader(`Navigated to ${sectionName} section`);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }

  setupKeyboardShortcuts() {
    // Add helpful keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Only trigger shortcuts when no input is focused
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'h':
        case 'H':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.navigateToSection('home');
            this.announceToScreenReader('Navigated to home section');
          }
          break;
        case 'a':
        case 'A':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.navigateToSection('about');
            this.announceToScreenReader('Navigated to about section');
          }
          break;
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.navigateToSection('skills');
            this.announceToScreenReader('Navigated to skills section');
          }
          break;
        case 'p':
        case 'P':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.navigateToSection('projects');
            this.announceToScreenReader('Navigated to projects section');
          }
          break;
        case 'c':
        case 'C':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.navigateToSection('contact');
            this.announceToScreenReader('Navigated to contact section');
          }
          break;
        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.toggleTheme();
          }
          break;
        case '?':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.showKeyboardShortcuts();
          }
          break;
      }
    });
  }

  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      // Focus the section for screen readers
      section.setAttribute('tabindex', '-1');
      section.focus();
      setTimeout(() => section.removeAttribute('tabindex'), 1000);
    }
  }

  showKeyboardShortcuts() {
    const shortcuts = [
      'H - Navigate to Home',
      'A - Navigate to About',
      'S - Navigate to Skills',
      'P - Navigate to Projects',
      'C - Navigate to Contact',
      'T - Toggle theme',
      'Escape - Close menus',
      '? - Show this help'
    ];

    this.announceToScreenReader(`Keyboard shortcuts available: ${shortcuts.join(', ')}`);
  }

  getSectionName(id) {
    const names = {
      'home': 'Home',
      'about': 'About Me',
      'experience': 'Work Experience',
      'skills': 'Technical Skills',
      'projects': 'Featured Projects',
      'contact': 'Contact Information'
    };
    return names[id] || id;
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.1, 0.3, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          // Add visible class with slight delay for better animation staging
          setTimeout(() => {
            entry.target.classList.add('section-visible');
          }, 100);

          // Unobserve once visible (performance optimization)
          if (entry.target.id !== 'home') {
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      if (section.id !== 'home') { // Home is already visible
        observer.observe(section);
      }
    });
  }

  setupProgressBarsObserver() {
    const progressBars = document.querySelectorAll('.progress');
    if (!progressBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.getAttribute('data-width');

          // Animate progress bar with a small delay for better visual effect
          setTimeout(() => {
            progressBar.style.width = `${width}%`;
          }, 200);

          observer.unobserve(progressBar);
        }
      });
    }, {
      threshold: 0.3
    });

    progressBars.forEach(bar => observer.observe(bar));
  }

  setupLazyImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    // Enhanced lazy loading with adaptive thresholds
    const connection = navigator.connection;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    const rootMargin = isSlowConnection ? '50px' : '200px';

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImageWithFallback(img, observer);
        }
      });
    }, {
      rootMargin,
      threshold: 0.1
    });

    images.forEach(img => {
      // Add placeholder background
      this.addImagePlaceholder(img);
      imageObserver.observe(img);
    });

    // Store observer for cleanup
    this.observers = this.observers || [];
    this.observers.push(imageObserver);
  }

  loadImageWithFallback(img, observer) {
    const src = img.getAttribute('data-src');
    const fallback = img.getAttribute('data-fallback');

    if (!src) return;

    // Add loading state with blur effect
    img.classList.add('loading');

    // Create optimized image loader
    const loader = new Image();

    // Don't set crossOrigin for GitHub images initially to avoid ORB issues
    // We'll try with crossOrigin only if the basic load fails

    // Set up loading timeout for slow connections
    const loadingTimeout = setTimeout(() => {
      console.warn(`Image loading timeout: ${src}`);
      this.handleImageLoadError(img, src, fallback);
    }, 10000);

    loader.onload = () => {
      clearTimeout(loadingTimeout);

      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        img.src = src;
        // Don't set crossOrigin for GitHub images to avoid ORB issues
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('data-src');

        // Remove placeholder
        this.removeImagePlaceholder(img);
      });
    };

    loader.onerror = () => {
      clearTimeout(loadingTimeout);
      console.warn(`Failed to load image: ${src}`);
      this.handleImageLoadError(img, src, fallback);
    };

    // Preload with optimal format detection
    loader.src = this.getOptimalImageFormat(src);
    observer.unobserve(img);
  }

  handleImageLoadError(img, originalSrc, fallback) {
    console.warn(`Image failed to load: ${originalSrc}`);

    // For GitHub URLs, try with CORS as a fallback
    if (originalSrc.includes('raw.githubusercontent.com')) {
      this.tryWithCORS(img, originalSrc, fallback);
      return;
    }

    // Use fallback or show error state
    if (fallback) {
      this.loadFallbackImage(img, fallback);
    } else {
      this.showImageError(img);
    }
  }

  tryWithCORS(img, src, fallback) {
    console.log(`Trying with CORS as fallback: ${src}`);
    const corsLoader = new Image();

    // Try with crossOrigin as fallback
    corsLoader.crossOrigin = 'anonymous';

    corsLoader.onload = () => {
      img.src = src;
      img.crossOrigin = 'anonymous';
      img.classList.remove('loading');
      img.classList.add('loaded');
      this.removeImagePlaceholder(img);
    };

    corsLoader.onerror = () => {
      console.warn(`Image failed even with CORS: ${src}`);
      if (fallback) {
        this.loadFallbackImage(img, fallback);
      } else {
        this.showImageError(img);
      }
    };

    corsLoader.src = src;
  }

  showImageError(img) {
    img.classList.remove('loading');
    img.classList.add('error');
    this.removeImagePlaceholder(img);

    // Add a fallback placeholder with project info
    const errorDiv = document.createElement('div');
    errorDiv.className = 'image-error';
    errorDiv.innerHTML = `
      <i class="fas fa-image" style="font-size: 2rem; color: var(--gray-400); margin-bottom: 0.5rem;"></i>
      <p style="color: var(--gray-500); font-size: 0.875rem; margin: 0;">Screenshot unavailable</p>
    `;
    errorDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: var(--gray-50);
      border-radius: inherit;
    `;

    img.parentNode.appendChild(errorDiv);
  }

  addImagePlaceholder(img) {
    // Create a low-quality placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, var(--gray-100), var(--gray-200));
      background-size: 20px 20px;
      background-image: 
        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.5) 75%);
      animation: placeholderShimmer 1.5s infinite linear;
      border-radius: inherit;
    `;

    if (img.parentNode && img.parentNode.style.position !== 'relative') {
      img.parentNode.style.position = 'relative';
    }

    img.parentNode?.appendChild(placeholder);
    img.placeholderElement = placeholder;
  }

  removeImagePlaceholder(img) {
    if (img.placeholderElement) {
      img.placeholderElement.remove();
      delete img.placeholderElement;
    }
  }

  loadFallbackImage(img, fallback) {
    const fallbackLoader = new Image();
    fallbackLoader.onload = () => {
      img.src = fallback;
      img.classList.remove('loading');
      img.classList.add('loaded', 'fallback');
      this.removeImagePlaceholder(img);
    };
    fallbackLoader.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      this.removeImagePlaceholder(img);
    };
    fallbackLoader.src = fallback;
  }

  getOptimalImageFormat(src) {
    // For GitHub raw URLs, don't convert formats - use original
    if (src.includes('raw.githubusercontent.com') || src.includes('github.com')) {
      return src;
    }

    // Check for WebP and AVIF support for other CDNs
    const supportsWebP = this.checkWebPSupport();
    const supportsAVIF = this.checkAVIFSupport();

    if (supportsAVIF && !src.includes('github')) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    } else if (supportsWebP && !src.includes('github')) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
(() => {
  'use strict';

  const qs = (sel, sc = document) => sc.querySelector(sel);
  const qsa = (sel, sc = document) => Array.from(sc.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    // Current year
    const yearEl = qs('#currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Page Loader
    const loader = qs('#pageLoader');
    const hideLoader = () => {
      if (!loader) return;
      if (prefersReduced) {
        loader.style.display = 'none';
      } else {
        loader.style.opacity = '0';
        setTimeout(() => {
          if (loader) loader.style.display = 'none';
        }, 300);
      }
    };
    // Hide on window load and add a timeout fallback
    window.addEventListener('load', () => setTimeout(hideLoader, 200), { once: true });
    setTimeout(hideLoader, 1200);

    // Theme handling
    const root = document.documentElement;
    const getThemeMeta = () => qs('meta[name="theme-color"]');
    const setThemeMeta = () => {
      const meta = getThemeMeta();
      const isDark = root.classList.contains('dark');
      if (meta) meta.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
    };
    const updateThemeIcon = () => {
      const isDark = root.classList.contains('dark');
      const deskIcon = qs('#themeIcon');
      const mobIcon = qs('#themeIconMobile');
      const swap = (el) => {
        if (!el) return;
        if (isDark) {
          el.classList.remove('fa-moon');
          el.classList.add('fa-sun');
        } else {
          el.classList.remove('fa-sun');
          el.classList.add('fa-moon');
        }
      };
      swap(deskIcon);
      swap(mobIcon);
      [qs('#themeToggle'), qs('#themeToggleMobile')].forEach((btn) => {
        if (btn) btn.setAttribute('aria-pressed', String(isDark));
      });
    };
    const toggleTheme = () => {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
      setThemeMeta();
      updateThemeIcon();
    };
    const themeBtn = qs('#themeToggle');
    const themeBtnMobile = qs('#themeToggleMobile');
    themeBtn && themeBtn.addEventListener('click', toggleTheme);
    themeBtnMobile && themeBtnMobile.addEventListener('click', toggleTheme);
    // Set correct icon for initial theme
    updateThemeIcon();

    // Mobile menu
    const mobileBtn = qs('#mobileMenuButton');
    const mobileMenu = qs('#mobileMenu');
    const toggleMobileMenu = () => {
      if (!mobileBtn || !mobileMenu) return;
      const willOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileBtn.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        // Focus the first interactive element for accessibility
        const firstLink = qs('a', mobileMenu);
        firstLink && firstLink.focus();
      }
    };
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', toggleMobileMenu);
      // Close on link click
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          mobileMenu.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileBtn.focus();
        }
      });
      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileBtn.focus();
        }
      });
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('hidden')) return;
        const clickInsideMenu = mobileMenu.contains(e.target);
        const clickOnButton = mobileBtn.contains(e.target) || e.target === mobileBtn;
        if (!clickInsideMenu && !clickOnButton) {
          mobileMenu.classList.add('hidden');
          mobileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Scroll progress + header shadow + back-to-top toggle
    const progress = qs('#scrollProgress');
    const header = qs('header');
    const scrollTopBtn = qs('#scrollTopBtn');

    const onScroll = () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      const doc = document.documentElement;
      const dh = doc.scrollHeight - window.innerHeight;
      const pct = dh > 0 ? (st / dh) * 100 : 0;

      if (progress) progress.style.width = pct + '%';

      if (header) {
        if (st > 4) header.classList.add('shadow', 'shadow-slate-900/5');
        else header.classList.remove('shadow', 'shadow-slate-900/5');
      }

      if (scrollTopBtn) {
        if (st > 600) scrollTopBtn.classList.remove('hidden');
        else scrollTopBtn.classList.add('hidden');
      }
    };

    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();

    // Scroll to top
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (prefersReduced) window.scrollTo(0, 0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Reveal on scroll
    const revealEls = qsa('[data-reveal]');
    if (revealEls.length) {
      // Initial state
      revealEls.forEach((el) => {
        el.style.opacity = '0';
        if (!prefersReduced) el.style.transform = 'translateY(12px)';
        el.style.transition = 'opacity 500ms ease, transform 500ms ease';
      });

      const revealObserver = new IntersectionObserver(
        (entries, ob) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              el.style.opacity = '1';
              el.style.transform = 'none';
              ob.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }

    // Typed text effect
    const typed = qs('#typedText');
    if (typed) {
      const words = [
        'Full‑Stack Developer',
        'UI Craftsperson',
        '.NET & Laravel Engineer',
        'Performance Advocate',
        'Problem Solver'
      ];
      let wordIndex = 0;
      let pos = 0;
      let dir = 1; // 1 typing, -1 deleting
      const speed = 60;
      const pauseFull = 900;
      const step = () => {
        const word = words[wordIndex];
        pos += dir;
        typed.textContent = word.slice(0, pos);

        if (dir > 0 && pos === word.length) {
          dir = -1;
          setTimeout(step, pauseFull);
          return;
        }
        if (dir < 0 && pos === 0) {
          dir = 1;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(step, 250);
          return;
        }
        setTimeout(step, prefersReduced ? 0 : speed);
      };
      setTimeout(step, 500);
    }

    // Lazy load images that use data-src
    const lazyImgs = qsa('img[data-src]');
    if (lazyImgs.length) {
      const loadImg = (img) => {
        const src = img.getAttribute('data-src');
        if (!src) return;
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
      };

      const imgObserver = new IntersectionObserver(
        (entries, ob) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImg(entry.target);
              ob.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      lazyImgs.forEach((img) => imgObserver.observe(img));
    }

    // Animate skill bars when visible
    const bars = qsa('.skill-bar');
    if (bars.length) {
      bars.forEach((bar) => {
        bar.style.width = '0%';
        bar.style.transition = 'width 900ms cubic-bezier(0.22, 1, 0.36, 1)';
      });

      const barObserver = new IntersectionObserver(
        (entries, ob) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const width = bar.getAttribute('data-width') || '0';
              bar.style.width = width + '%';
              ob.unobserve(bar);
            }
          });
        },
        { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }
      );

      bars.forEach((bar) => barObserver.observe(bar));
    }

    // Projects filtering with keyboard support
    const filterBtns = qsa('.filter-btn');
    const cards = qsa('.project-card');
    const grid = qs('#projectsGrid');

    const setActiveBtn = (btn) => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('border', 'border-slate-300', 'dark:border-slate-700');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('border', 'border-slate-300', 'dark:border-slate-700');
      btn.setAttribute('aria-selected', 'true');
    };

    const applyFilter = (filter) => {
      if (!grid) return;
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        if (show) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    };

    if (filterBtns.length) {
      filterBtns.forEach((btn) => {
        btn.setAttribute('tabindex', '0');

        btn.addEventListener('click', () => {
          setActiveBtn(btn);
          const filter = btn.getAttribute('data-filter') || 'all';
          applyFilter(filter);
        });

        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const i = filterBtns.indexOf(btn);
            const next = filterBtns[(i + dir + filterBtns.length) % filterBtns.length];
            next && next.focus();
          }
        });
      });

      // Initialize to the active button or the first
      const initial = filterBtns.find((b) => b.classList.contains('active')) || filterBtns[0];
      if (initial) {
        setActiveBtn(initial);
        applyFilter(initial.getAttribute('data-filter') || 'all');
      }
    }
  });
})();
    return src;
  }

  checkWebPSupport() {
    if (this.webpSupport !== undefined) return this.webpSupport;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    this.webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return this.webpSupport;
  }

  checkAVIFSupport() {
    if (this.avifSupport !== undefined) return this.avifSupport;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    this.avifSupport = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    return this.avifSupport;
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalImages = [
      'https://avatars.githubusercontent.com/u/35147?v=4' // Profile image
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  initializeProjects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    // Show all projects initially
    projectCards.forEach((card, index) => {
      card.style.display = 'block';
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    });

    // Add click handlers to filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => this.filterProjects(button));
    });
  }

  // Event Handlers
  handleScroll() {
    if (!this.isScrolling) {
      requestAnimationFrame(() => {
        this.updateScrollProgress();
        this.updateScrollTopButton();
        this.updateNavigationOnScroll();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }
  }

  handleDocumentClick(e) {
    if (!this.nav?.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  handleAnchorClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Close mobile menu if open
      this.closeMobileMenu();

      // Smooth scroll to target
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL without triggering scroll
      history.pushState(null, null, targetId);
    }
  }

  handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
      this.closeMobileMenu();
      // Return focus to mobile menu button if it was closed via keyboard
      if (this.mobileMenuBtn) {
        this.mobileMenuBtn.focus();
      }
    }

    if (e.key === 'Tab') {
      // Ensure keyboard navigation visibility
      document.body.classList.add('keyboard-navigation');
    }

    // Enhanced keyboard navigation for project filters
    if (e.target.matches('.filter-btn')) {
      this.handleFilterKeyNavigation(e);
    }

    // Enhanced keyboard navigation for experience items and projects
    if (e.target.matches('.experience-item, .project-card')) {
      this.handleCardKeyNavigation(e);
    }
  }

  handleFilterKeyNavigation(e) {
    const currentFilter = e.target;
    const allFilters = [...document.querySelectorAll('.filter-btn')];
    const currentIndex = allFilters.indexOf(currentFilter);

    let nextIndex;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : allFilters.length - 1;
        allFilters[nextIndex].focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextIndex = currentIndex < allFilters.length - 1 ? currentIndex + 1 : 0;
        allFilters[nextIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        allFilters[0].focus();
        break;
      case 'End':
        e.preventDefault();
        allFilters[allFilters.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        currentFilter.click();
        break;
    }
  }

  handleCardKeyNavigation(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Find and click the primary link within the card
      const link = e.target.querySelector('a');
      if (link) {
        link.click();
      }
    }
  }

  handleResize() {
    // Close mobile menu on resize to prevent layout issues
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }

    // Update scroll progress on resize
    this.updateScrollProgress();
  }

  handleFocusIn(e) {
    // Add focus-visible class for better keyboard navigation styling
    if (e.target.matches('a, button, [tabindex]:not([tabindex="-1"])')) {
      e.target.classList.add('focus-visible');
    }
  }

  handleFocusOut(e) {
    e.target.classList.remove('focus-visible');
  }

  setupHoverPrefetch() {
    // Prefetch critical interactions on hover for better performance
    const interactiveElements = document.querySelectorAll('a[href^="#"], .cta-button, .filter-btn');

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        // Warm up the interaction - can add specific prefetch logic here
        element.classList.add('hover-prefetch');
      }, { once: false, passive: true });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-prefetch');
      }, { passive: true });
    });
  }

  // Navigation Methods
  toggleMobileMenu() {
    this.mobileMenuBtn?.classList.toggle('active');
    this.navLinks?.classList.toggle('active');

    // Prevent body scroll when menu is open
    const isActive = this.navLinks?.classList.contains('active');
    document.body.style.overflow = isActive ? 'hidden' : '';

    // Update ARIA attributes for accessibility
    this.mobileMenuBtn?.setAttribute('aria-expanded', isActive.toString());

    // Manage focus for better accessibility
    if (isActive) {
      // Focus first link when menu opens
      const firstLink = this.navLinks?.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
      this.announceToScreenReader('Mobile navigation menu opened');
    } else {
      this.announceToScreenReader('Mobile navigation menu closed');
    }
  }

  closeMobileMenu() {
    this.mobileMenuBtn?.classList.remove('active');
    this.navLinks?.classList.remove('active');
    document.body.style.overflow = '';
    this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  updateActiveNavigation(sectionId) {
    if (!this.navAnchors || !this.navAnchors.length) return;

    this.navAnchors.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const isActive = href === `#${sectionId}`;
      // aria-current for accessibility
      a.setAttribute('aria-current', isActive ? 'page' : 'false');

      // Toggle Tailwind utility classes for clear visual hierarchy
      a.classList.toggle('text-indigo-600', isActive);
      a.classList.toggle('dark:text-indigo-400', isActive);
      a.classList.toggle('font-semibold', isActive);
      a.classList.toggle('underline', isActive);
      a.classList.toggle('decoration-2', isActive);
      a.classList.toggle('decoration-indigo-500', isActive);
    });
  }

  updateNavigationOnScroll() {
    if (!this.sections || !this.sections.length) return;

    // Consider a point slightly below the top for better UX
    const offsetY = window.scrollY + window.innerHeight * 0.28;
    let currentId = this.sections[0].id;

    this.sections.forEach((section) => {
      const top = section.offsetTop;
      if (top <= offsetY) {
        currentId = section.id;
      }
    });

    this.updateActiveNavigation(currentId);
  }

  // Scroll Methods with optimizations
  updateScrollProgress() {
    if (!this.scrollProgress) return;

    // Use cached values for better performance
    if (!this.scrollCache) {
      this.scrollCache = {
        windowHeight: document.documentElement.scrollHeight - window.innerHeight,
        lastUpdate: 0
      };
    }

    const now = performance.now();
    if (now - this.scrollCache.lastUpdate > 16) { // Throttle to ~60fps
      const scrolled = (window.scrollY / this.scrollCache.windowHeight) * 100;
      const progress = Math.min(Math.max(scrolled, 0), 100);

      this.scrollProgress.style.transform = `scaleX(${progress / 100})`;
      this.scrollProgress.style.transformOrigin = 'left';

      this.scrollCache.lastUpdate = now;
    }
  }

  updateScrollTopButton() {
    if (!this.scrollTopBtn) return;

    const shouldShow = window.scrollY > 500;
    this.scrollTopBtn.classList.toggle('visible', shouldShow);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Theme Methods
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    this.updateThemeIcon(newTheme);

    // Announce theme change for screen readers
    this.announceThemeChange(newTheme);
  }

  updateThemeIcon(theme) {
    if (!this.themeToggle) return;

    const icon = this.themeToggle.querySelector('i');
    if (icon) {
      icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
    }

    // Update aria-label for accessibility
    this.themeToggle.setAttribute('aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
    );
  }

  announceThemeChange(theme) {
    this.announceToScreenReader(`Switched to ${theme} mode`);
  }

  announceFilterChange(filter, count) {
    const filterText = filter === 'all' ? 'all projects' : `${filter} projects`;
    this.announceToScreenReader(`Showing ${count} ${filterText}`);
  }

  announceToScreenReader(message) {
    // Use the dedicated live region created in setupLiveRegionUpdates
    let announcement = document.getElementById('aria-live-region');
    if (!announcement) {
      // Fallback: create announcement element if not found
      announcement = document.createElement('div');
      announcement.id = 'aria-live-region';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }

    // Clear and set new message with proper timing
    announcement.textContent = '';
    requestAnimationFrame(() => {
      setTimeout(() => {
        announcement.textContent = message;
      }, 100);
    });
  }

  // Update copyright year to current year
  updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      const currentYear = new Date().getFullYear();
      yearElement.textContent = currentYear;
    }
  }

  // Project Filtering
  filterProjects(activeButton) {
    const filterValue = activeButton.getAttribute('data-filter');
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.querySelector('#projects-grid');

    // Update active button and ARIA states
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');

    // Update tabpanel labelledby
    if (projectsGrid) {
      projectsGrid.setAttribute('aria-labelledby', activeButton.id);
    }

    // Filter projects with smooth animation
    let visibleCount = 0;
    projectCards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filterValue === 'all' || category === filterValue;

      if (shouldShow) {
        card.style.display = 'block';
        card.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 50);
        visibleCount++;
      } else {
        card.classList.remove('visible');
        card.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Announce filter change for accessibility
    this.announceFilterChange(filterValue, visibleCount);
  }

  // Removed - functionality moved to announceToScreenReader method

  // Page Loader
  initializePageLoader() {
    if (!this.pageLoader) return;

    // Simulate loading time for demo purposes
    const minLoadTime = 1500;
    const startTime = performance.now();

    const hideLoader = () => {
      const elapsedTime = performance.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        this.pageLoader.classList.add('loaded');

        // Remove from DOM after animation completes
        setTimeout(() => {
          if (this.pageLoader.parentNode) {
            this.pageLoader.parentNode.removeChild(this.pageLoader);
          }
        }, 600);
      }, remainingTime);
    };

    // Check if all critical resources are loaded
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  // Typing Animation
  startTypingAnimation() {
    if (!this.typedTextSpan) return;

    setTimeout(() => {
      this.typeText();
    }, 1000);
  }

  typeText() {
    const currentText = this.textArray[this.textIndex];

    if (this.isDeleting) {
      this.typedTextSpan.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.typedTextSpan.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.textArray.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(() => this.typeText(), typeSpeed);
  }

  // Utility Methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Performance monitoring with Web Vitals
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.observeNavigationTiming();
    this.observePaintTiming();
    this.observeLayoutShift();
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
  }

  observeNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.metrics.pageLoadTime = entry.loadEventEnd - entry.loadEventStart;
            this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            this.metrics.firstByte = entry.responseStart - entry.requestStart;
            console.log('Performance Metrics:', this.metrics);
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  observePaintTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  observeLayoutShift() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  observeLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  observeFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
