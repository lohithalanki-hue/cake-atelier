/* ═══════════════════════════════════════════════════════
   CAKE ATELIER — GSAP Motion Layer
   Cinematic scroll-driven animations
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Bail on reduced motion ───
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ─── Wait for GSAP ───
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-active');

  // ─── Custom easing (Emil Kowalski) ───
  const easeOutExpo = 'expo.out';
  const easeInOutExpo = 'expo.inOut';

  // ─── Loading Curtain ───
  const curtain = document.querySelector('.loading-curtain');
  if (curtain) {
    const curtainTl = gsap.timeline();
    curtainTl
      .to('.curtain-text', {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: easeOutExpo
      })
      .to('.curtain-sub', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: easeOutExpo
      }, '-=0.3')
      .to(['.curtain-text', '.curtain-sub'], {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.3
      })
      .to(curtain, {
        yPercent: -100,
        duration: 1,
        ease: easeInOutExpo
      })
      .set(curtain, { display: 'none' });
  }

  // ─── Hero — Cinematic Entrance ───
  const heroTl = gsap.timeline({ delay: curtain ? 1.8 : 0.2 });

  // Hero image — dramatic scale + clip entrance
  const heroWrap = document.querySelector('.hero__image-wrap');
  if (heroWrap) {
    gsap.set(heroWrap, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hero__image-wrap img', { scale: 1.3 });

    heroTl
      .to(heroWrap, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.4,
        ease: easeInOutExpo
      }, 0)
      .to('.hero__image-wrap img', {
        scale: 1.05,
        duration: 1.8,
        ease: easeOutExpo
      }, 0.2);
  }

  // Hero accent border
  const heroAccent = document.querySelector('.hero__image-accent');
  if (heroAccent) {
    gsap.set(heroAccent, { opacity: 0, x: 30, y: -30 });
    heroTl.to(heroAccent, {
      opacity: 0.3,
      x: 0,
      y: 0,
      duration: 1,
      ease: easeOutExpo
    }, 0.8);
  }

  // ─── Hero Scroll Parallax ───
  if (heroWrap) {
    gsap.to('.hero__image-wrap img', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Hero text parallax on scroll
  const heroText = document.querySelector('.hero__text');
  if (heroText) {
    gsap.to(heroText, {
      yPercent: -20,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'center center',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // ─── Marquee — Infinite Scroll ───
  const marqueeInner = document.querySelector('.marquee__inner');
  if (marqueeInner) {
    const marqueeWidth = marqueeInner.scrollWidth / 2;

    gsap.to(marqueeInner, {
      x: -marqueeWidth,
      duration: 25,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % marqueeWidth)
      }
    });

    // Rotate direction on scroll
    ScrollTrigger.create({
      trigger: '.marquee',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        gsap.to(marqueeInner, {
          timeScale: self.direction === -1 ? -1 : 1,
          overwrite: true,
          duration: 0.3
        });
      }
    });
  }

  // ─── Art Section — Split Reveal ───
  const artImage = document.querySelector('.art-section__image');
  if (artImage) {
    gsap.set(artImage, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set('.art-section__image img', { scale: 1.2 });

    ScrollTrigger.create({
      trigger: artImage,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(artImage, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: easeInOutExpo
        });
        gsap.to('.art-section__image img', {
          scale: 1,
          duration: 1.6,
          ease: easeOutExpo,
          delay: 0.1
        });
      }
    });
  }

  // Art section — parallax on the image
  if (artImage) {
    gsap.to('.art-section__image img', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.art-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Art section — counter animation
  document.querySelectorAll('.art-section__detail-number').forEach(el => {
    const text = el.textContent.trim();
    const hasPlus = text.includes('+');
    const hasComma = text.includes(',');
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);

    if (isNaN(num)) return;

    const obj = { val: 0 };
    el.textContent = '0';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: num,
          duration: 2,
          ease: easeOutExpo,
          onUpdate: () => {
            let display = Math.round(obj.val);
            if (hasComma) {
              display = display.toLocaleString();
            }
            el.textContent = display + (hasPlus ? '+' : '');
          }
        });
      }
    });
  });

  // ─── Art Section — Headline Text Reveal ───
  const artTitle = document.querySelector('.art-section__title');
  if (artTitle) {
    gsap.set(artTitle, { overflow: 'hidden' });
    const artTitleInner = artTitle.innerHTML;
    artTitle.innerHTML = `<span class="text-reveal-inner" style="display:block">${artTitleInner}</span>`;
    gsap.set('.art-section__title .text-reveal-inner', { yPercent: 100 });

    ScrollTrigger.create({
      trigger: artTitle,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.art-section__title .text-reveal-inner', {
          yPercent: 0,
          duration: 1,
          ease: easeOutExpo
        });
      }
    });
  }

  // ─── Signature Creations — Staggered Cards ───
  const cakeCards = gsap.utils.toArray('.cake-card');
  if (cakeCards.length) {
    gsap.set(cakeCards, {
      y: 60,
      opacity: 0,
      rotateX: 4
    });

    ScrollTrigger.batch(cakeCards, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: easeOutExpo,
          stagger: 0.12
        });
      }
    });
  }

  // ─── Cake Cards — 3D Tilt on Hover ───
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.cake-card__image').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: x * 6,
          rotateX: -y * 6,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: easeOutExpo
        });
      });
    });
  }

  // ─── Creations — Section Title Entrance ───
  const creationsTitle = document.querySelector('.creations__title');
  if (creationsTitle) {
    gsap.set(creationsTitle, { overflow: 'hidden' });
    const creationsTitleInner = creationsTitle.innerHTML;
    creationsTitle.innerHTML = `<span class="text-reveal-inner" style="display:block">${creationsTitleInner}</span>`;
    gsap.set('.creations__title .text-reveal-inner', { yPercent: 100 });

    ScrollTrigger.create({
      trigger: creationsTitle,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.creations__title .text-reveal-inner', {
          yPercent: 0,
          duration: 1,
          ease: easeOutExpo
        });
      }
    });
  }

  // ─── Process Section — Scroll-Driven Horizontal Timeline (Desktop) ───
  const processSection = document.querySelector('.process');
  const processTimeline = document.querySelector('.process__timeline');
  const processSteps = gsap.utils.toArray('.process__step');

  if (processSection && processTimeline && processSteps.length && window.innerWidth > 1024) {
    // Override grid to horizontal layout for pinned scroll
    processTimeline.style.display = 'flex';
    processTimeline.style.width = `${processSteps.length * 30}vw`;
    processTimeline.style.gap = '4vw';

    processSteps.forEach(step => {
      step.style.minWidth = '24vw';
      step.style.flex = '0 0 auto';
    });

    // Pin and scroll horizontally
    const horizontalTween = gsap.to(processTimeline, {
      x: () => -(processTimeline.scrollWidth - window.innerWidth + 120),
      ease: 'none',
      scrollTrigger: {
        trigger: processSection,
        start: 'top top',
        end: () => `+=${processTimeline.scrollWidth - window.innerWidth + 200}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // Stagger step reveals during horizontal scroll
    processSteps.forEach((step) => {
      gsap.fromTo(step,
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            containerAnimation: horizontalTween,
            start: 'left 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // ─── Process Section — Step Image Parallax ───
  document.querySelectorAll('.process__step-image img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ─── Custom Cakes — Image Reveal ───
  const customImage = document.querySelector('.custom__image');
  if (customImage) {
    gsap.set(customImage, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.custom__image img', { scale: 1.2 });

    ScrollTrigger.create({
      trigger: customImage,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(customImage, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: easeInOutExpo
        });
        gsap.to('.custom__image img', {
          scale: 1,
          duration: 1.6,
          ease: easeOutExpo,
          delay: 0.1
        });
      }
    });
  }

  // Custom section — title reveal
  const customTitle = document.querySelector('.custom__title');
  if (customTitle) {
    gsap.set(customTitle, { overflow: 'hidden' });
    const customTitleInner = customTitle.innerHTML;
    customTitle.innerHTML = `<span class="text-reveal-inner" style="display:block">${customTitleInner}</span>`;
    gsap.set('.custom__title .text-reveal-inner', { yPercent: 100 });

    ScrollTrigger.create({
      trigger: customTitle,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.custom__title .text-reveal-inner', {
          yPercent: 0,
          duration: 1,
          ease: easeOutExpo
        });
      }
    });
  }

  // ─── Configurator Builder Steps — Stagger In ───
  const builderSteps = gsap.utils.toArray('.builder-step');
  if (builderSteps.length) {
    gsap.set(builderSteps, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.custom-builder',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(builderSteps, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: easeOutExpo,
          stagger: 0.1
        });
      }
    });
  }

  // ─── Testimonials — Staggered Cards ───
  const testimonialCards = gsap.utils.toArray('.testimonial-card');
  if (testimonialCards.length) {
    gsap.set(testimonialCards, { y: 50, opacity: 0 });

    ScrollTrigger.batch(testimonialCards, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: easeOutExpo,
          stagger: 0.15
        });
      }
    });
  }

  // ─── Testimonials Title Reveal ───
  const testTitle = document.querySelector('.testimonials__title');
  if (testTitle) {
    gsap.set(testTitle, { overflow: 'hidden' });
    const testTitleInner = testTitle.innerHTML;
    testTitle.innerHTML = `<span class="text-reveal-inner" style="display:block">${testTitleInner}</span>`;
    gsap.set('.testimonials__title .text-reveal-inner', { yPercent: 100 });

    ScrollTrigger.create({
      trigger: testTitle,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to('.testimonials__title .text-reveal-inner', {
          yPercent: 0,
          duration: 1,
          ease: easeOutExpo
        });
      }
    });
  }

  // ─── Final CTA — Cinematic Entrance ───
  const finalCta = document.querySelector('.final-cta');
  if (finalCta) {
    // Background parallax
    gsap.to('.final-cta__bg img', {
      yPercent: 20,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: finalCta,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Title scale entrance
    const finalTitle = document.querySelector('.final-cta__title');
    if (finalTitle) {
      gsap.set(finalTitle, { scale: 0.85, opacity: 0 });

      ScrollTrigger.create({
        trigger: finalCta,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.to(finalTitle, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: easeOutExpo
          });
        }
      });
    }

    // Subtitle and button stagger
    const finalText = document.querySelector('.final-cta__text');
    const finalBtn = document.querySelector('.final-cta .btn--accent');
    if (finalText && finalBtn) {
      gsap.set([finalText, finalBtn], { y: 30, opacity: 0 });

      ScrollTrigger.create({
        trigger: finalCta,
        start: 'top 55%',
        once: true,
        onEnter: () => {
          gsap.to(finalText, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: easeOutExpo,
            delay: 0.3
          });
          gsap.to(finalBtn, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: easeOutExpo,
            delay: 0.5
          });
        }
      });
    }
  }

  // ─── Section Labels — Animated Line Accent ───
  document.querySelectorAll('.art-section__label, .creations__label, .process__label, .custom__label, .testimonials__label').forEach(label => {
    // Create a small line that draws in next to the label
    const line = document.createElement('span');
    line.classList.add('label-line');
    line.setAttribute('aria-hidden', 'true');
    label.prepend(line);
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '0.75em';

    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: label,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(line, {
          scaleX: 1,
          duration: 0.8,
          ease: easeOutExpo,
          delay: 0.2
        });
      }
    });
  });

  // ─── Footer Reveal ───
  const footer = document.querySelector('.footer');
  if (footer) {
    const footerItems = footer.querySelectorAll('.footer__inner > *');
    gsap.set(footerItems, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(footerItems, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: easeOutExpo,
          stagger: 0.1
        });
      }
    });
  }

  // ─── Smooth Scroll Speed for all section background transitions ───
  // Slight scale on section images as they enter viewport
  document.querySelectorAll('.art-section__image img, .custom__image img').forEach(img => {
    gsap.fromTo(img, 
      { scale: 1.08 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      }
    );
  });

  // ─── Occasion Tags — Stagger In ───
  const occasions = gsap.utils.toArray('.custom__occasion');
  if (occasions.length) {
    gsap.set(occasions, { y: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.custom__occasions',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(occasions, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: easeOutExpo,
          stagger: 0.08
        });
      }
    });
  }

  // ─── Nav — Entrance Animation ───
  const navInner = document.querySelector('.nav__inner');
  if (navInner) {
    gsap.set(navInner, { y: -20, opacity: 0 });
    gsap.to(navInner, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: easeOutExpo,
      delay: curtain ? 1.9 : 0.1
    });
  }

  // ─── Scroll Progress Bar ───
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }

  console.log('🎂 Cake Atelier — GSAP animations initialized');

})();
