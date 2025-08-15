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
    this.pageLoader = document.querySelector('#pageLoader');

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
    this.initializePageLoader();
    this.updateCopyrightYear();

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

    // Focus handling for better keyboard navigation
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Prefetch hover states for better performance
    this.setupHoverPrefetch();
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

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            // Add loading state
            img.classList.add('loading');
            
            // Create a new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              // Update src and add loaded class
              img.src = src;
              img.classList.remove('loading');
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            };
            newImg.onerror = () => {
              img.classList.remove('loading');
              console.warn(`Failed to load image: ${src}`);
            };
            newImg.src = src;
          }

          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'
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
    this.announceToScreenReader(`Switched to ${theme} mode`);
  }
  
  announceFilterChange(filter, count) {
    const filterText = filter === 'all' ? 'all projects' : `${filter} projects`;
    this.announceToScreenReader(`Showing ${count} ${filterText}`);
  }
  
  announceToScreenReader(message) {
    // Create or reuse existing announcement element
    let announcement = document.getElementById('screen-reader-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'screen-reader-announcement';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }
    
    // Clear and set new message
    announcement.textContent = '';
    setTimeout(() => {
      announcement.textContent = message;
    }, 100);
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

// Performance monitoring (optional)
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.entryType === 'navigation') {
        console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
      }
    });
  });
  observer.observe({ entryTypes: ['navigation'] });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
