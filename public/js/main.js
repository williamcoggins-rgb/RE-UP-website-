/* ============================================
   RE UP Report — Main JavaScript
   Market intelligence platform for barbers
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Progress Bar ----
  const scrollProgress = document.createElement('div');
  scrollProgress.classList.add('scroll-progress');
  scrollProgress.setAttribute('role', 'progressbar');
  scrollProgress.setAttribute('aria-label', 'Page scroll progress');
  document.body.prepend(scrollProgress);

  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ---- Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    updateScrollProgress();

    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  handleScroll();

  // ---- Mobile Menu Toggle ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  function closeMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    setTimeout(() => {
      mobileMenu.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.contains('active');
      mobileToggle.classList.toggle('active');

      if (!isActive) {
        mobileMenu.style.display = 'block';
        requestAnimationFrame(() => {
          mobileMenu.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
      }

      mobileToggle.setAttribute('aria-expanded', !isActive);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ---- Escape Key Closes Mobile Menu ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileToggle && mobileToggle.classList.contains('active')) {
        closeMobileMenu();
      }
    }
  });

  // ---- Scroll Animations (IntersectionObserver) ----
  const animatedElements = document.querySelectorAll('[data-animate]');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));

  // ---- Counter Animation for Hero Stats ----
  const statNumbers = document.querySelectorAll('.hero-stat-number[data-count]');

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();

    // Preserve any suffix text (like +, %, etc.) after the number
    const originalText = element.textContent.trim();
    const suffix = originalText.replace(/[\d,]+/, '');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.round(eased * target);
      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (mobileToggle && mobileToggle.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  });

});
