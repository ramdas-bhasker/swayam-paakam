/* ==========================================================================
   SWAYAMPAAKAM – Premium South Indian Restaurant & Franchise Website
   Main JavaScript: assets/js/main.js
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. Sticky Header, Mobile Navigation & Hero Parallax
     ---------------------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroParallaxImg = document.getElementById('heroParallaxImg');

  function closeMobileMenu() {
    if (!navMenu || !mobileMenuToggle) return;
    navMenu.classList.remove('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  function onWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (heroParallaxImg && scrollY < window.innerHeight && window.innerWidth > 768) {
      heroParallaxImg.style.transform =
        'scale(1.03) translateY(' + (scrollY * 0.16).toFixed(1) + 'px)';
    }
  }

  window.addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll();

  /* ----------------------------------------------------------------------
     2. Scroll Reveal Observer
     ---------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -35px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----------------------------------------------------------------------
     3. Menu Category Filtering (Works on menu.html & index.html)
     ---------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuCategoryBlocks = document.querySelectorAll('.menu-category-block');
  const viewFullMenuBtn = document.getElementById('viewFullMenuBtn');
  const footerMenuJumpLinks = document.querySelectorAll('[data-menu-jump]');

  function applyMenuFilter(filterValue) {
    if (!filterButtons.length || !menuCategoryBlocks.length) return;

    filterButtons.forEach(function (btn) {
      const isMatch = btn.getAttribute('data-filter') === filterValue;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    menuCategoryBlocks.forEach(function (block) {
      const group = block.getAttribute('data-group');
      if (filterValue === 'all' || group === filterValue) {
        block.classList.remove('hidden-category');
      } else {
        block.classList.add('hidden-category');
      }
    });

    if (viewFullMenuBtn && viewFullMenuBtn.tagName === 'BUTTON') {
      const span = viewFullMenuBtn.querySelector('span');
      if (span) {
        span.textContent =
          filterValue === 'all'
            ? 'All Signature Categories Displayed'
            : 'View Full Menu';
      }
    }
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filterValue = btn.getAttribute('data-filter');
      applyMenuFilter(filterValue);
    });
  });

  if (viewFullMenuBtn && viewFullMenuBtn.tagName === 'BUTTON') {
    viewFullMenuBtn.addEventListener('click', function () {
      applyMenuFilter('all');
      const menuColumnsGrid = document.getElementById('menuColumnsGrid');
      if (menuColumnsGrid) {
        menuColumnsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  footerMenuJumpLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const targetFilter = link.getAttribute('data-menu-jump');
      if (targetFilter && menuCategoryBlocks.length) {
        applyMenuFilter(targetFilter);
      }
    });
  });

  // Check URL query parameter ?category=... on menu.html load
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam && menuCategoryBlocks.length) {
    applyMenuFilter(categoryParam);
  }

  /* ----------------------------------------------------------------------
     4. Franchise Enquiry Popup Modal & Form Validation
     ---------------------------------------------------------------------- */
  const franchiseModal = document.getElementById('franchiseModal');
  const openModalBtns = document.querySelectorAll('.js-open-franchise-modal');
  const closeModalBtn = document.getElementById('closeFranchiseModal');
  const doneModalBtn = document.getElementById('doneFranchiseModalBtn');
  const resetFormBtn = document.getElementById('resetFranchiseFormBtn');

  const formView = document.getElementById('franchiseFormView');
  const successView = document.getElementById('franchiseSuccessView');
  const franchiseForm = document.getElementById('franchiseEnquiryForm');
  const summaryList = document.getElementById('enquirySummaryList');

  const fullNameInput = document.getElementById('fullName');
  const mobileInput = document.getElementById('mobileNumber');
  const emailInput = document.getElementById('emailAddress');
  const cityInput = document.getElementById('cityLocation');
  const investmentInput = document.getElementById('investmentRange');
  const messageInput = document.getElementById('enquiryMessage');

  let lastFocusedElement = null;

  function openFranchiseModal() {
    if (!franchiseModal) return;
    lastFocusedElement = document.activeElement;
    closeMobileMenu();
    franchiseModal.classList.add('is-open');
    franchiseModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setTimeout(function () {
      if (successView && !successView.classList.contains('is-active') && fullNameInput) {
        fullNameInput.focus();
      } else if (closeModalBtn) {
        closeModalBtn.focus();
      }
    }, 120);
  }

  function closeFranchiseModal() {
    if (!franchiseModal) return;
    franchiseModal.classList.remove('is-open');
    franchiseModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  openModalBtns.forEach(function (btn) {
    btn.addEventListener('click', openFranchiseModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeFranchiseModal);
  }

  if (doneModalBtn) {
    doneModalBtn.addEventListener('click', closeFranchiseModal);
  }

  if (franchiseModal) {
    franchiseModal.addEventListener('click', function (event) {
      if (event.target === franchiseModal) {
        closeFranchiseModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && franchiseModal && franchiseModal.classList.contains('is-open')) {
      closeFranchiseModal();
    }
  });

  function setFieldError(inputEl, groupId, isInvalid) {
    const groupEl = document.getElementById(groupId);
    if (!groupEl || !inputEl) return;
    if (isInvalid) {
      inputEl.classList.add('is-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
      groupEl.classList.add('has-error');
    } else {
      inputEl.classList.remove('is-invalid');
      inputEl.setAttribute('aria-invalid', 'false');
      groupEl.classList.remove('has-error');
    }
  }

  function validateFullName() {
    if (!fullNameInput) return false;
    const val = fullNameInput.value.trim();
    const valid = val.length >= 2;
    setFieldError(fullNameInput, 'groupFullName', !valid);
    return valid;
  }

  function validateIndianMobile() {
    if (!mobileInput) return false;
    const raw = mobileInput.value.trim();
    const cleaned = raw.replace(/[\s\-()]/g, '');
    const indianMobileRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    const valid = indianMobileRegex.test(cleaned);
    setFieldError(mobileInput, 'groupMobile', !valid);
    return valid;
  }

  function validateEmailOptional() {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    if (val === '') {
      setFieldError(emailInput, 'groupEmail', false);
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const valid = emailRegex.test(val);
    setFieldError(emailInput, 'groupEmail', !valid);
    return valid;
  }

  function validateCity() {
    if (!cityInput) return false;
    const val = cityInput.value.trim();
    const valid = val.length >= 2;
    setFieldError(cityInput, 'groupCity', !valid);
    return valid;
  }

  if (fullNameInput) {
    fullNameInput.addEventListener('input', function () {
      if (fullNameInput.classList.contains('is-invalid')) validateFullName();
    });
  }
  if (mobileInput) {
    mobileInput.addEventListener('input', function () {
      if (mobileInput.classList.contains('is-invalid')) validateIndianMobile();
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', function () {
      if (emailInput.classList.contains('is-invalid')) validateEmailOptional();
    });
  }
  if (cityInput) {
    cityInput.addEventListener('input', function () {
      if (cityInput.classList.contains('is-invalid')) validateCity();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (franchiseForm) {
    franchiseForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const isNameValid = validateFullName();
      const isMobileValid = validateIndianMobile();
      const isEmailValid = validateEmailOptional();
      const isCityValid = validateCity();

      if (!isNameValid || !isMobileValid || !isEmailValid || !isCityValid) {
        const firstInvalid = franchiseForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const enquiryPayload = {
        fullName: fullNameInput.value.trim(),
        mobileNumber: mobileInput.value.trim(),
        emailAddress: emailInput.value.trim() || 'Not provided',
        cityLocation: cityInput.value.trim(),
        investmentRange: investmentInput.value || 'Not specified',
        message: messageInput.value.trim() || '—',
        submittedAt: new Date().toISOString()
      };

      window.SWAYAMPAAKAM_LAST_FRANCHISE_ENQUIRY = enquiryPayload;

      if (summaryList) {
        summaryList.innerHTML =
          '<dt>Full Name</dt><dd>' + escapeHtml(enquiryPayload.fullName) + '</dd>' +
          '<dt>Mobile Number</dt><dd>' + escapeHtml(enquiryPayload.mobileNumber) + '</dd>' +
          '<dt>Email Address</dt><dd>' + escapeHtml(enquiryPayload.emailAddress) + '</dd>' +
          '<dt>City / Location</dt><dd>' + escapeHtml(enquiryPayload.cityLocation) + '</dd>' +
          '<dt>Investment Range</dt><dd>' + escapeHtml(enquiryPayload.investmentRange) + '</dd>' +
          '<dt>Message</dt><dd>' + escapeHtml(enquiryPayload.message) + '</dd>';
      }

      if (formView) formView.style.display = 'none';
      if (successView) successView.classList.add('is-active');
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', function () {
      if (franchiseForm) franchiseForm.reset();
      ['groupFullName', 'groupMobile', 'groupEmail', 'groupCity'].forEach(function (gid) {
        const g = document.getElementById(gid);
        if (g) g.classList.remove('has-error');
      });
      [fullNameInput, mobileInput, emailInput, cityInput].forEach(function (inp) {
        if (inp) inp.classList.remove('is-invalid');
      });
      if (successView) successView.classList.remove('is-active');
      if (formView) formView.style.display = 'block';
      if (fullNameInput) fullNameInput.focus();
    });
  }
})();

