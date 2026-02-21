/* ============================================
   RE UP — Main JavaScript
   UX Engine: Motion, micro-interactions, state mgmt
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Progress Bar ----
  const scrollProgress = document.createElement('div');
  scrollProgress.classList.add('scroll-progress');
  scrollProgress.setAttribute('role', 'progressbar');
  scrollProgress.setAttribute('aria-label', 'Page scroll progress');
  document.body.prepend(scrollProgress);

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ---- Cursor Glow (desktop only) ----
  let cursorGlow = null;
  if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
    cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ---- Card Spotlight Effect ----
  const cards = document.querySelectorAll('.course-card, .pricing-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ---- Button Ripple Effect ----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--ripple-x', x + '%');
      btn.style.setProperty('--ripple-y', y + '%');
    });
  });

  // ---- Magnetic Button Effect (desktop only) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-lg');
    const magnetStrength = 0.3;
    const magnetRadius = 80;

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < magnetRadius) {
          const pull = (1 - distance / magnetRadius) * magnetStrength;
          btn.style.transform = 'translate(' + (deltaX * pull) + 'px, ' + (deltaY * pull) + 'px)';
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---- 3D Card Tilt Effect (desktop only) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.course-card, .pricing-card, .feature-card');
    const maxTilt = 6;

    tiltCards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * maxTilt;
        const rotateY = (x - 0.5) * maxTilt;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // ---- Mobile Menu Toggle ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

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
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll Animations (IntersectionObserver) ----
  const animatedElements = document.querySelectorAll('[data-animate], [data-reveal]');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  // ---- Counter Animation (Stats) ----
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element) {
    const text = element.textContent.trim();
    const match = text.match(/^(\d+)(\+?)(%?)$/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = (match[2] || '') + (match[3] || '');
    const duration = 1800;
    const start = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.round(eased * target);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Course Filter (with smooth transitions) ----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('.course-card[data-category], .blog-card[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterGroup = btn.closest('.course-filters');
      filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      filterableCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.classList.remove('filter-hide');
          // Re-trigger entrance
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add('visible');
            });
          });
        } else {
          card.classList.add('filter-hide');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ---- FAQ Accordion (Smooth animation) ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });

      // Open clicked if wasn't already open
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Navbar Scroll Effects ----
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Progress bar
    updateScrollProgress();

    // Navbar styling
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Newsletter Form (with state feedback) ----
  const newsletterForm = document.querySelector('.inline-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.form-input');
      const submitBtn = newsletterForm.querySelector('.btn');

      if (!input || !input.value) return;

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add('is-error');
        showFormMessage(newsletterForm, 'Please enter a valid email address.', 'error');
        setTimeout(() => input.classList.remove('is-error'), 2000);
        return;
      }

      // Simulate loading
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        input.value = '';
        input.classList.add('is-success');
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        showFormMessage(newsletterForm, "You're in! Welcome to RE UP.", 'success');
        showToast("You're subscribed! Check your inbox.", 'success');

        setTimeout(() => {
          input.classList.remove('is-success');
        }, 3000);
      }, 800);
    });
  }

  // ---- Form Message Helper ----
  function showFormMessage(form, text, type) {
    let msg = form.parentElement.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('p');
      msg.classList.add('form-message');
      form.parentElement.appendChild(msg);
    }
    msg.textContent = text;
    msg.className = 'form-message ' + type;
    requestAnimationFrame(() => {
      msg.classList.add('visible');
    });
    setTimeout(() => {
      msg.classList.remove('visible');
    }, 4000);
  }

  // ---- Toast Notification System ----
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.classList.add('toast', type || '');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const icon = type === 'success' ? '\u2713' : type === 'error' ? '\u2717' : '\u24D8';
    toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // ---- Smooth Parallax for Visual Card ----
  const visualCard = document.querySelector('.visual-card');
  if (visualCard && window.matchMedia('(pointer: fine)').matches) {
    const splitSection = visualCard.closest('.section-split');
    if (splitSection) {
      window.addEventListener('scroll', () => {
        const rect = splitSection.getBoundingClientRect();
        const progress = -rect.top / (rect.height + window.innerHeight);
        const translateY = (progress - 0.5) * 40;
        visualCard.style.transform = 'translateY(' + translateY + 'px)';
      }, { passive: true });
    }
  }

  // ---- Staggered Grid Animations ----
  const grids = document.querySelectorAll('.course-grid, .blog-page-grid, .features-grid, .pricing-grid');
  grids.forEach(grid => {
    const children = grid.querySelectorAll('[data-animate]');
    children.forEach((child, index) => {
      child.style.transitionDelay = (index * 80) + 'ms';
    });
  });

  // ---- Carousels — Drag/Swipe, No Autoplay, Multiple Instances ----
  // Each .hero-carousel gets its own independent carousel state
  const allCarousels = document.querySelectorAll('.hero-carousel');
  const carouselInstances = [];

  allCarousels.forEach((container) => {
    const track = container.querySelector('.carousel-track');
    const slides = container.querySelectorAll('.carousel-slide');
    const dots = container.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    const state = {
      currentSlide: 0,
      totalSlides: slides.length,
      isDragging: false,
      startX: 0,
      currentTranslate: 0,
      prevTranslate: 0,
      dragDistance: 0
    };

    function getSlideWidth() {
      return container.offsetWidth;
    }

    function setPosition(translate) {
      track.style.transform = 'translateX(' + translate + 'px)';
    }

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= state.totalSlides) index = state.totalSlides - 1;
      state.currentSlide = index;
      state.currentTranslate = -state.currentSlide * getSlideWidth();
      state.prevTranslate = state.currentTranslate;
      track.classList.remove('is-dragging');
      setPosition(state.currentTranslate);
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === state.currentSlide);
      });
    }

    function snapAfterDrag() {
      state.isDragging = false;
      track.classList.remove('is-dragging');
      container.classList.remove('is-swiping');
      const threshold = getSlideWidth() * 0.15;

      if (state.dragDistance < -threshold) {
        goToSlide(state.currentSlide + 1);
      } else if (state.dragDistance > threshold) {
        goToSlide(state.currentSlide - 1);
      } else {
        goToSlide(state.currentSlide);
      }
      state.dragDistance = 0;
    }

    // Dot click navigation
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const slideIndex = parseInt(dot.dataset.slide, 10);
        goToSlide(slideIndex);
      });
    });

    // --- Touch events (on container — overlay won't block touch) ---
    container.addEventListener('touchstart', (e) => {
      // Don't start drag if touching a button/link
      if (e.target.closest('.btn, .carousel-dot')) return;
      state.isDragging = true;
      state.startX = e.touches[0].clientX;
      state.dragDistance = 0;
      track.classList.add('is-dragging');
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!state.isDragging) return;
      const currentX = e.touches[0].clientX;
      state.dragDistance = currentX - state.startX;
      state.currentTranslate = state.prevTranslate + state.dragDistance;
      setPosition(state.currentTranslate);
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (!state.isDragging) return;
      snapAfterDrag();
    });

    // --- Mouse events (on container — overlay won't block mouse) ---
    container.addEventListener('mousedown', (e) => {
      // Don't start drag if clicking a button/link
      if (e.target.closest('.btn, .carousel-dot, a')) return;
      state.isDragging = true;
      state.startX = e.clientX;
      state.dragDistance = 0;
      track.classList.add('is-dragging');
      container.classList.add('is-swiping');
      e.preventDefault();
    });

    container.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      const currentX = e.clientX;
      state.dragDistance = currentX - state.startX;
      state.currentTranslate = state.prevTranslate + state.dragDistance;
      setPosition(state.currentTranslate);
    });

    container.addEventListener('mouseup', () => {
      if (!state.isDragging) return;
      snapAfterDrag();
    });

    container.addEventListener('mouseleave', () => {
      if (!state.isDragging) return;
      snapAfterDrag();
    });

    // Prevent image drag
    container.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      goToSlide(state.currentSlide);
    });

    // Initialize
    goToSlide(0);

    carouselInstances.push({ container, state, goToSlide });
  });

  // ---- Course Carousel Scroll Reveal ----
  const courseCarousels = document.querySelectorAll('.course-carousel');
  if (courseCarousels.length > 0) {
    const carouselRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          carouselRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    courseCarousels.forEach(c => carouselRevealObserver.observe(c));
  }

  // Keyboard navigation — control the carousel closest to viewport center
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (carouselInstances.length === 0) return;

    const viewCenter = window.innerHeight / 2;
    let closest = carouselInstances[0];
    let closestDist = Infinity;

    carouselInstances.forEach(inst => {
      const rect = inst.container.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - viewCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = inst;
      }
    });

    if (e.key === 'ArrowLeft') closest.goToSlide(closest.state.currentSlide - 1);
    if (e.key === 'ArrowRight') closest.goToSlide(closest.state.currentSlide + 1);
  });

  // ---- Hero Parallax Depth ----
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  if (hero && heroContent && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        heroContent.style.transform = 'translateY(' + (progress * 60) + 'px)';
        heroContent.style.opacity = 1 - (progress * 0.6);
      }
    }, { passive: true });
  }

  // ---- Keyboard Navigation ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (mobileToggle && mobileToggle.classList.contains('active')) {
        mobileToggle.click();
      }
      // Close any open FAQ
      faqItems.forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = '0';
      });
    }
  });

  // ---- Performance: Throttled scroll handler ----
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

  // ---- Initial Scroll Check ----
  handleScroll();

});
