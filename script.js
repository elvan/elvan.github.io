/**
 * Modern Portfolio - Interactive Functionality
 * Optimized for performance with efficient event handling and smooth animations
 */

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
    this.initializeTheme();
    this.initializeProjects();
    this.startTypingAnimation();

    // Initialize with home section visible
    const homeSection = document.querySelector('#home');
    if (homeSection) {
      homeSection.classList.add('section-visible');
    }

    console.log('Portfolio App initialized successfully');
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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Resize handling (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 250);
    }, { passive: true });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.1, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class for animations
          entry.target.classList.add('section-visible');

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

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.onload = () => {
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${src}`);
            };
          }

          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
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
    }

    if (e.key === 'Tab') {
      // Ensure keyboard navigation visibility
      document.body.classList.add('keyboard-navigation');
    }
  }

  handleResize() {
    // Close mobile menu on resize to prevent layout issues
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
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
  }

  closeMobileMenu() {
    this.mobileMenuBtn?.classList.remove('active');
    this.navLinks?.classList.remove('active');
    document.body.style.overflow = '';
    this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  updateActiveNavigation(sectionId) {
    // Active navigation styling removed - no longer needed
    // This method is kept for potential future use
    return;
  }

  updateNavigationOnScroll() {
    // Navigation active state tracking removed
    // This method is kept empty for potential future use
    return;
  }

  // Scroll Methods
  updateScrollProgress() {
    if (!this.scrollProgress) return;

    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    const progress = Math.min(Math.max(scrolled, 0), 100);

    this.scrollProgress.style.width = `${progress}%`;
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
    const announcement = document.createElement('div');
    announcement.textContent = `Switched to ${theme} mode`;
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Project Filtering
  filterProjects(activeButton) {
    const filterValue = activeButton.getAttribute('data-filter');
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');

    // Filter projects with smooth animation
    projectCards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filterValue === 'all' || category === filterValue;

      if (shouldShow) {
        card.style.display = 'block';
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 50);
      } else {
        card.classList.remove('visible');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Announce filter change for accessibility
    const visibleCount = document.querySelectorAll('.project-card.visible').length;
    this.announceFilterChange(filterValue, visibleCount);
  }

  announceFilterChange(filter, count) {
    const announcement = document.createElement('div');
    const filterText = filter === 'all' ? 'all projects' : `${filter} projects`;
    announcement.textContent = `Showing ${count} ${filterText}`;
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
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

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
