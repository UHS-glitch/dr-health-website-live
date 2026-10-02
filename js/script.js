/* ================================================================
 * DR. HEALTH WEBSITE — FUNCTIONALITY + CONFIG APPLICATION
 * ================================================================ */

(function () {
  'use strict';

  const C = SITE_CONFIG;
  const productOrderText = `Hi ${C.business.name}, I want to order the ${C.product.shortName}.`;
  const productOrderUrl = `https://wa.me/${C.business.whatsapp}?text=${encodeURIComponent(productOrderText)}`;
  const whatsappUrl = `https://wa.me/${C.business.whatsapp}`;

  // ---------- Easy-update configuration ----------
  function replaceTextInBody(replacements) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(function (textNode) {
      if (!textNode.nodeValue.trim()) return;
      // Never modify code inside scripts/styles.
      const parent = textNode.parentElement;
      if (parent && /^(SCRIPT|STYLE|NOSCRIPT)$/i.test(parent.tagName)) return;

      let value = textNode.nodeValue;
      replacements.forEach(function (item) {
        value = value.replace(item.from, item.to);
      });
      textNode.nodeValue = value;
    });
  }

  function applySiteConfig() {
    // Page metadata
    document.title = C.seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', C.seo.description);

    // Brand
    document.querySelectorAll('.brand-name').forEach(function (el) {
      el.textContent = C.business.name;
    });

    // Common text values currently present in the original site.
    replaceTextInBody([
      { from: /Dr\. Health/g, to: C.business.name },
      { from: /3 in 1 Steam Inhaler/g, to: C.product.shortName },
      { from: /₹999\.00/g, to: `₹${C.product.price.toFixed(2)}` },
      { from: /₹999\b/g, to: `₹${C.product.price}` },
      { from: /MRP 999\b/g, to: `MRP ${C.product.price}` },
      { from: /12 Months Warranty/g, to: C.product.warranty },
      { from: /Free Shipping Across India/g, to: C.shipping.banner },
      { from: /\+91 94212 08624/g, to: C.business.phoneDisplay },
      { from: /universalproduct20@gmail\.com/g, to: C.business.email },
      { from: /Dr\. Health, Tajcem Ware Houses, Survey No\. 10\/13, Shed No\. 16, Opposite Gagan Renaissance, Behind Dharmavat Petrol Pump, Pisoli, Pune – 411060, India/g, to: C.business.address },
      { from: /DL No\. MH\/PD\/PUN-Zone-3\/07\/MD-42\/14\/2025-26/g, to: C.business.licence },
      { from: /DR ORG Healthcare Pvt Ltd, Bawana, New Delhi 110039/g, to: C.business.manufacturer }
    ]);

    // Phone/email links
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.setAttribute('href', 'tel:' + C.business.phoneTel);
      if (a.textContent.indexOf('+91') !== -1) a.textContent = C.business.phoneDisplay;
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.setAttribute('href', 'mailto:' + C.business.email);
      a.textContent = C.business.email;
    });

    // WhatsApp links. Order buttons get a pre-filled order message;
    // the footer's plain chat link remains a normal WhatsApp chat.
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      if (a.classList.contains('btn-wa') || a.classList.contains('wa-float')) {
        a.setAttribute('href', productOrderUrl);
      } else {
        a.setAttribute('href', whatsappUrl);
      }
    });

    // Quantity selector — automatically follows the configured price.
    const qty = document.getElementById('qty');
    if (qty) {
      const options = qty.querySelectorAll('option');
      options.forEach(function (option) {
        const match = option.value.match(/^([1-3])$/);
        if (match) {
          const count = Number(match[1]);
          option.textContent = `${count} unit${count > 1 ? 's' : ''} — ₹${C.product.price * count}`;
        }
      });
    }
  }

  // Year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Apply editable configuration before wiring interactions.
  applySiteConfig();

  // Header shadow on scroll
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // Mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Active section highlighting (scrollspy)
  const SECTION_IDS = ['features', 'benefits', 'howto', 'price', 'faq', 'contact'];
  const spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"], .foot-col a[href^="#"]')
  );

  function setActiveSection(id) {
    spyLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  const spySections = SECTION_IDS
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function updateSpy() {
    const pos = window.scrollY + 140;
    let current = '';
    spySections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 6) {
      current = SECTION_IDS[SECTION_IDS.length - 1];
    }
    setActiveSection(current);
  }

  window.addEventListener('scroll', updateSpy, { passive: true });
  window.addEventListener('resize', updateSpy);
  updateSpy();

  // Smooth in-page navigation.
  const HEADER_OFFSET = 90;
  function goToSection(href) {
    if (!href || href.charAt(0) !== '#' || href === '#') return false;
    const target = document.getElementById(href.slice(1));
    if (!target) return false;
    let top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    if (top < 0) top = 0;
    try { window.scrollTo({ top: top, behavior: 'smooth' }); }
    catch (e) { window.scrollTo(0, top); }
    return true;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      const href = a.getAttribute('href');
      if (goToSection(href)) {
        ev.preventDefault();
        if (href.length > 1) setActiveSection(href.slice(1));
        if (burger && mobileMenu) {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
        }
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (it) { it.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Enquiry form -> WhatsApp
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const city = document.getElementById('city').value.trim();
      const qty = document.getElementById('qty').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone) {
        alert('Please enter your name and phone number so we can reach you.');
        return;
      }

      const lines = [
        `Hello ${C.business.name}, I would like to enquire about the ${C.product.shortName}.`,
        '',
        'Name: ' + name,
        'Phone: ' + phone
      ];
      if (city) lines.push('City / Pin: ' + city);
      lines.push('Quantity: ' + qty);
      if (message) lines.push('Message: ' + message);

      const url = 'https://wa.me/' + C.business.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank');
    });
  }
})();
