// Navigation
const nav = document.querySelector('nav');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Add active class to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNavOnScroll() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLink?.classList.add('active');
    } else {
      navLink?.classList.remove('active');
    }
  });
}

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// Project Filtering
const initializeProjects = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectsGrid = document.querySelector('.projects-grid');

  // Show all projects initially
  const showAllProjects = () => {
    projectCards.forEach((card, index) => {
      card.style.display = 'block';
      // Add small delay for staggered animation
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    });
  };

  // Filter projects
  const filterProjects = (filter) => {
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.style.display = 'block';
        // Small delay to ensure display: block is applied
        setTimeout(() => {
          card.classList.add('visible');
        }, 50);
      } else {
        card.classList.remove('visible');
        // Wait for fade out animation before hiding
        setTimeout(() => {
          card.style.display = 'none';
        }, 500);
      }
    });
  };

  // Add click handlers to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter projects
      filterProjects(button.dataset.filter);
    });
  });

  // Initialize with all projects visible
  showAllProjects();
};

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeProjects();
});

// Smooth section reveal on scroll
const revealSections = () => {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => {
    observer.observe(section);
  });
};

// Smooth scroll behavior for navigation links
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  revealSections();
  smoothScroll();
  animateProgressBars();
});

// Animate progress bars when they come into view
const animateProgressBars = () => {
  const progressBars = document.querySelectorAll('.progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.getAttribute('data-width');
        progressBar.style.width = `${width}%`;
        observer.unobserve(progressBar);
      }
    });
  }, {
    threshold: 0.5
  });

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
};

// Improved scroll reveal with Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
      if (entry.target.classList.contains('skill-card')) {
        entry.target.style.transitionDelay = `${entry.target.dataset.delay}ms`;
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize animations with proper delays
document.addEventListener('DOMContentLoaded', () => {
  // Show home section immediately
  const homeSection = document.querySelector('#home');
  if (homeSection) {
    homeSection.classList.add('section-visible');
  }

  // Add delay to skill cards
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    card.dataset.delay = index * 100;
    revealObserver.observe(card);
  });

  // Observe other sections and project cards
  const elementsToReveal = document.querySelectorAll('section:not(#home), .project-card');
  elementsToReveal.forEach(element => {
    revealObserver.observe(element);
  });

  // Start typing animation
  setTimeout(type, 1000);
});

// Typing Animation
const typedTextSpan = document.querySelector('.typed-text');
const textArray = [
  'Software Developer',
  'Full Stack Engineer',
  'UI/UX Enthusiast',
  'Problem Solver'
];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 2000);
  }
}

function erase() {
  if (charIndex > 0) {
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50);
  } else {
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, 1000);
  }
}

// Improved scroll progress indicator
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

// Improved theme toggle with local storage
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = `<i class="fas fa-${savedTheme === 'dark' ? 'sun' : 'moon'}"></i>`;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
  });
}

// Add loading attribute to images only when they're about to be viewed
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.onload = () => {
          img.classList.add('loaded');
          observer.unobserve(img);
        };
      }
    }
  });
}, {
  rootMargin: '50px'
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  
  highlightNavOnScroll();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Lazy loading images with fade-in effect
const loadImage = (img) => {
  const src = img.dataset.src;
  if (!src) return;

  img.src = src;
  img.onload = () => {
    img.classList.add('loaded');
    delete img.dataset.src;
  };
};

const lazyImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '50px'
});

document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => lazyImageObserver.observe(img));
});
