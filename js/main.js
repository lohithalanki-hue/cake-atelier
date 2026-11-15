/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — Interactions & Animation
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Reduced Motion Check ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Navigation ───
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile menu
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Reveal on Scroll ───
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const clipElements = document.querySelectorAll('[data-clip-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-40px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    clipElements.forEach(el => revealObserver.observe(el));
  } else {
    // Show everything immediately
    document.querySelectorAll('[data-reveal], [data-clip-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
  }

  // ─── Hero Parallax (cursor-responsive) ───
  if (!prefersReducedMotion) {
    const heroImage = document.querySelector('.hero__image-wrap img');
    const hero = document.querySelector('.hero');

    if (heroImage && hero && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = x * 12;
        targetY = y * 8;
      });

      hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });

      function animateParallax() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        heroImage.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
        requestAnimationFrame(animateParallax);
      }
      animateParallax();
    }
  }

  // ─── Hero Text Entrance ───
  if (!prefersReducedMotion) {
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      const words = heroTitle.innerHTML.split(/\s+/);
      heroTitle.innerHTML = words.map((word, i) =>
        `<span class="hero-word" style="animation-delay: ${200 + i * 80}ms">${word}</span>`
      ).join(' ');

      // Add CSS for word animation
      const style = document.createElement('style');
      style.textContent = `
        .hero-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(0.4em);
          animation: heroWordIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes heroWordIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Hero label entrance
    const heroLabel = document.querySelector('.hero__label');
    if (heroLabel) {
      heroLabel.style.opacity = '0';
      heroLabel.style.transform = 'translateY(12px)';
      setTimeout(() => {
        heroLabel.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        heroLabel.style.opacity = '1';
        heroLabel.style.transform = 'translateY(0)';
      }, 100);
    }

    // Hero subtitle entrance
    const heroSub = document.querySelector('.hero__subtitle');
    if (heroSub) {
      heroSub.style.opacity = '0';
      heroSub.style.transform = 'translateY(16px)';
      setTimeout(() => {
        heroSub.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        heroSub.style.opacity = '1';
        heroSub.style.transform = 'translateY(0)';
      }, 600);
    }

    // Hero actions entrance
    const heroActions = document.querySelector('.hero__actions');
    if (heroActions) {
      heroActions.style.opacity = '0';
      heroActions.style.transform = 'translateY(16px)';
      setTimeout(() => {
        heroActions.style.transition = 'opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        heroActions.style.opacity = '1';
        heroActions.style.transform = 'translateY(0)';
      }, 800);
    }

    // Hero image entrance (clip reveal)
    const heroImageWrap = document.querySelector('.hero__image-wrap');
    if (heroImageWrap) {
      heroImageWrap.style.clipPath = 'inset(100% 0 0 0)';
      setTimeout(() => {
        heroImageWrap.style.transition = 'clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1)';
        heroImageWrap.style.clipPath = 'inset(0 0 0 0)';
      }, 300);
    }

    // Hero accent entrance
    const heroAccent = document.querySelector('.hero__image-accent');
    if (heroAccent) {
      heroAccent.style.opacity = '0';
      heroAccent.style.transform = 'translate(20px, -20px)';
      setTimeout(() => {
        heroAccent.style.transition = 'opacity 1s cubic-bezier(0.23, 1, 0.32, 1), transform 1s cubic-bezier(0.23, 1, 0.32, 1)';
        heroAccent.style.opacity = '0.3';
        heroAccent.style.transform = 'translate(0, 0)';
      }, 800);
    }
  }

  // ─── Cake Cards — Modal ───
  const cakeCards = document.querySelectorAll('.cake-card');
  const modalOverlay = document.getElementById('cake-modal');

  const cakeData = [
    {
      name: 'Midnight Velvet',
      price: '\$85',
      description: 'A rich dark chocolate cake layered with Belgian ganache and a hint of espresso. Finished with edible gold leaf and hand-tempered chocolate shards.',
      serves: '8–10',
      layers: 'Three',
      flavor: 'Dark Chocolate & Espresso'
    },
    {
      name: 'Rose & Pistachio',
      price: '\$78',
      description: 'Delicate pistachio sponge infused with Persian rosewater, layered with pistachio cream and decorated with dried rose petals and crushed pistachios.',
      serves: '8–10',
      layers: 'Three',
      flavor: 'Pistachio & Rosewater'
    },
    {
      name: 'Caramel Brûlée',
      price: '\$72',
      description: 'Vanilla bean sponge with salted caramel buttercream, torched caramel top, and a caramelised white chocolate drip. Finished with candied hazelnuts.',
      serves: '6–8',
      layers: 'Two',
      flavor: 'Vanilla & Salted Caramel'
    },
    {
      name: 'Berry Pavlova',
      price: '\$68',
      description: 'A stunning layered pavlova with crisp meringue, Chantilly cream, and a cascade of fresh seasonal berries. Light, airy, and unforgettable.',
      serves: '6–8',
      layers: 'Two',
      flavor: 'Meringue & Mixed Berry'
    },
    {
      name: 'Citrus Garden',
      price: '\$75',
      description: 'Lemon and yuzu sponge layered with bergamot curd and elderflower buttercream. Adorned with candied citrus slices and edible flowers.',
      serves: '8–10',
      layers: 'Three',
      flavor: 'Lemon, Yuzu & Elderflower'
    },
    {
      name: 'Hazelnut Praline',
      price: '\$82',
      description: 'Gianduja mousse between layers of hazelnut dacquoise, covered in a mirror glaze of milk chocolate. A celebration of texture and warmth.',
      serves: '10–12',
      layers: 'Four',
      flavor: 'Hazelnut & Milk Chocolate'
    }
  ];

  cakeCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openCakeModal(index);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCakeModal(index);
      }
    });
  });

  let activeCake = null;

  function openCakeModal(index) {
    const data = cakeData[index];
    if (!data || !modalOverlay) return;
    activeCake = data;

    const img = cakeCards[index].querySelector('img');
    const modalImg = modalOverlay.querySelector('.modal__image img');
    const modalName = modalOverlay.querySelector('.modal__name');
    const modalPrice = modalOverlay.querySelector('.modal__price');
    const modalDesc = modalOverlay.querySelector('.modal__description');
    const details = modalOverlay.querySelectorAll('.modal__detail-value');

    if (modalImg && img) modalImg.src = img.src;
    if (modalImg && img) modalImg.alt = img.alt;
    if (modalName) modalName.textContent = data.name;
    if (modalPrice) modalPrice.textContent = data.price;
    if (modalDesc) modalDesc.textContent = data.description;
    if (details[0]) details[0].textContent = data.serves;
    if (details[1]) details[1].textContent = data.layers;
    if (details[2]) details[2].textContent = data.flavor;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const closeBtn = modalOverlay.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  // Close modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal__close')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // ─── Order Form ───
  const orderBtns = document.querySelectorAll('[data-open-order]');
  const orderModal = document.getElementById('order-modal');
  const orderForm = document.getElementById('order-form');

  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If clicking from inside cake detail modal, close cake modal first and pre-fill details
      if (modalOverlay && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        if (activeCake) {
          const detailsField = document.getElementById('order-details');
          if (detailsField) {
            detailsField.value = `Order inquiry for signature creation: ${activeCake.name} (${activeCake.price}) — ${activeCake.flavor}, Serves ${activeCake.serves}.`;
          }
        }
      }
      if (orderModal) {
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const nameInput = document.getElementById('order-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 100);
      }
    });
  });

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate
      const required = orderForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--highlight)';
          field.addEventListener('input', function handler() {
            field.style.borderColor = '';
            field.removeEventListener('input', handler);
          });
        }
      });

      if (!valid) return;

      const submitBtn = orderForm.querySelector('button[type="submit"]');
      const nameVal = document.getElementById('order-name')?.value || 'Guest';
      const emailVal = document.getElementById('order-email')?.value || '';
      const occasionVal = document.getElementById('order-occasion')?.value || 'Celebration';
      const sizeVal = document.getElementById('order-size')?.value || '';

      if (submitBtn) {
        submitBtn.classList.add('btn--loading');
        submitBtn.disabled = true;
      }

      // Simulate art-directed asynchronous submission
      setTimeout(() => {
        const formContent = orderForm.closest('.modal__content');
        if (formContent) {
          formContent.innerHTML = `
            <div class="form-success" style="animation: heroWordIn 0.5s ease-out forwards;">
              <div class="form-success__icon" style="color: var(--caramel); font-size: 2.5rem; line-height: 1; margin-bottom: var(--space-sm);">✦</div>
              <h3 class="form-success__title" style="margin-bottom: var(--space-xs);">Inquiry Received, ${nameVal}</h3>
              <p class="form-success__text" style="margin-bottom: var(--space-md); color: var(--muted); font-size: var(--text-sm);">
                We have logged your bespoke vision for your <strong>${occasionVal}</strong> (${sizeVal}).
              </p>
              <div style="background: var(--ivory); border: 1px solid var(--cream); padding: var(--space-sm) var(--space-md); margin-bottom: var(--space-lg); text-align: left; font-size: var(--text-xs); color: var(--chocolate);">
                <p style="margin-bottom: 4px;"><strong>Confirmation Sent:</strong> ${emailVal}</p>
                <p style="color: var(--muted);">Our master patissier will reach out within 24 hours with design sketches and ingredient availability.</p>
              </div>
              <button type="button" class="btn btn--primary" id="success-dismiss-btn" style="width: 100%; justify-content: center;">
                Return to Atelier
              </button>
            </div>
          `;

          const dismissBtn = formContent.querySelector('#success-dismiss-btn');
          if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
              const orderModal = document.getElementById('order-modal');
              if (orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = '';
              }
            });
          }
        }
      }, 600);
    });
  }

  // ─── Process Steps — Staggered Reveal ───
  if (!prefersReducedMotion) {
    const processSteps = document.querySelectorAll('.process__step');
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const steps = entry.target.closest('.process__timeline')?.querySelectorAll('.process__step');
          if (steps) {
            steps.forEach((step, i) => {
              setTimeout(() => {
                step.classList.add('revealed');
              }, i * 120);
            });
          }
          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (processSteps.length > 0) {
      processObserver.observe(processSteps[0]);

      // Add styles for process step animation
      const style = document.createElement('style');
      style.textContent = `
        .process__step {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1),
                      transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .process__step.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ─── Image Lazy Loading ───
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ─── Magnetic Buttons ───
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn--primary, .btn--accent').forEach(btn => {
      let btnX = 0, btnY = 0;
      let targetBtnX = 0, targetBtnY = 0;
      let animating = false;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        targetBtnX = x * 0.15;
        targetBtnY = y * 0.25;

        if (!animating) {
          animating = true;
          function animate() {
            btnX += (targetBtnX - btnX) * 0.12;
            btnY += (targetBtnY - btnY) * 0.12;
            btn.style.transform = `translate(${btnX}px, ${btnY}px)`;
            if (Math.abs(targetBtnX - btnX) > 0.1 || Math.abs(targetBtnY - btnY) > 0.1) {
              requestAnimationFrame(animate);
            } else {
              animating = false;
            }
          }
          requestAnimationFrame(animate);
        }
      });

      btn.addEventListener('mouseleave', () => {
        targetBtnX = 0;
        targetBtnY = 0;
        animating = true;
        function snapBack() {
          btnX += (0 - btnX) * 0.12;
          btnY += (0 - btnY) * 0.12;
          btn.style.transform = `translate(${btnX}px, ${btnY}px)`;
          if (Math.abs(btnX) > 0.1 || Math.abs(btnY) > 0.1) {
            requestAnimationFrame(snapBack);
          } else {
            btn.style.transform = '';
            animating = false;
          }
        }
        requestAnimationFrame(snapBack);
      });
    });
  }

  // ─── Nav link active state based on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));

    // Active nav link style
    const navStyle = document.createElement('style');
    navStyle.textContent = `.nav__link.active { color: var(--caramel); }
      .nav__link.active::after { width: 100%; }`;
    document.head.appendChild(navStyle);
  }

  // ─── Custom Luxury Cursor ───
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const cursorText = document.querySelector('.cursor-text');

    if (cursor && dot && ring) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      let isVisible = false;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        if (!isVisible) {
          cursor.style.opacity = '1';
          isVisible = true;
        }
      });

      document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        isVisible = false;
      });

      function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(renderCursor);
      }
      renderCursor();

      // Interactive hover targets
      const interactiveTargets = document.querySelectorAll('a, button, .nav__logo, .builder-chip');
      interactiveTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovering');
        });
      });

      // Cake cards view state
      const cakeCards = document.querySelectorAll('.cake-card');
      cakeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          cursor.classList.add('viewing');
          if (cursorText) cursorText.textContent = 'View';
        });
        card.addEventListener('mouseleave', () => {
          cursor.classList.remove('viewing');
          if (cursorText) cursorText.textContent = '';
        });
      });

      // Press state
      window.addEventListener('mousedown', () => {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.6)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(0.85)`;
      });
      window.addEventListener('mouseup', () => {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
      });
    }
  }

  // ─── Filter Tabs for Signature Creations ───
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.cake-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ─── Interactive Atelier Configurator ───
  const builderChips = document.querySelectorAll('.builder-chip');
  const priceDisplay = document.getElementById('builder-price-display');
  const leadDisplay = document.getElementById('builder-lead-display');
  const builderOrderBtn = document.getElementById('builder-order-btn');

  let configState = {
    occasion: 'Wedding',
    scale: 'Small (6–8 servings)',
    basePrice: 95,
    lead: '3 days recommended',
    flavor: 'Dark Chocolate',
    finish: 'Smooth Velvet Buttercream',
    finishCost: 0
  };

  builderChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('.builder-options').dataset.group;
      chip.closest('.builder-options').querySelectorAll('.builder-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (group === 'occasion') {
        configState.occasion = chip.dataset.val;
      } else if (group === 'scale') {
        configState.scale = chip.dataset.val;
        configState.basePrice = parseInt(chip.dataset.price, 10);
        configState.lead = `${chip.dataset.lead} recommended`;
      } else if (group === 'flavor') {
        configState.flavor = chip.dataset.val;
      } else if (group === 'finish') {
        configState.finish = chip.dataset.val;
        configState.finishCost = parseInt(chip.dataset.add, 10);
      }

      const total = configState.basePrice + configState.finishCost;
      if (priceDisplay) {
        priceDisplay.textContent = `$${total}`;
      }
      if (leadDisplay) {
        leadDisplay.textContent = `Lead time: ${configState.lead}`;
      }
    });
  });

  if (builderOrderBtn) {
    builderOrderBtn.addEventListener('click', () => {
      const orderModal = document.getElementById('order-modal');
      if (orderModal) {
        // Pre-fill form fields
        const occField = document.getElementById('order-occasion');
        const sizeField = document.getElementById('order-size');
        const flavorField = document.getElementById('order-flavor');
        const detailsField = document.getElementById('order-details');

        if (occField) occField.value = configState.occasion;
        if (sizeField) sizeField.value = configState.scale;
        if (flavorField) flavorField.value = configState.flavor;
        if (detailsField) {
          detailsField.value = `Selected Finish: ${configState.finish}\nEstimated: $${configState.basePrice + configState.finishCost} (${configState.lead})`;
        }

        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

})();
