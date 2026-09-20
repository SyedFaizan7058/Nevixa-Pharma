(function () {
  'use strict';

  function addAnimations() {
    var selectors = [
      'main > section',
      'body > section',
      '.hero',
      '.hero-content > *',
      '.hero-grid > *',
      '.nvx-section',
      '.products-section',
      '.expertise-section',
      '.quality-section',
      '.quality-promise',
      '.faq-section',
      '.contact-card',
      '.contact-form',
      '.section-head',
      '.nvx-section-head',
      '.feature-card',
      '.expertise-card',
      '.quality-list > div',
      '.nvx-division-card',
      '.product-search',
      '.filter-group',
      '.products-result-summary',
      '.load-more-wrap',
      '.product-detail-card',
      '.detail-breadcrumb',
      '.related-products-head',
      '.faq-item',
      '.product-card'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, index) {
        if (!el.hasAttribute('data-aos')) {
          el.setAttribute('data-aos', el.classList.contains('product-card') ? 'fade-up' : 'fade-up');
        }
        if (el.classList.contains('product-card') && !el.hasAttribute('data-aos-delay')) {
          el.setAttribute('data-aos-delay', String((index % 4) * 70));
        }
      });
    });
  }

  function init() {
    addAnimations();

    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 70,
        mirror: false,
        anchorPlacement: 'top-bottom',
        disable: function () {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.NevixaAOS = {
    refresh: function () {
      addAnimations();
      if (window.AOS) AOS.refreshHard();
    }
  };
})();
