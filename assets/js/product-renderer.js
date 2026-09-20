(function () {
  'use strict';
  var products = window.NEVIXA_PRODUCTS || [];
  var PAGE_SIZE = 12;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (c) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[c];
    });
  }
  function wa(name) {
    return 'https://wa.me/9326095981?text=' + encodeURIComponent('Hello Nevixa Pharma, I would like to enquire about ' + name + '.');
  }
  function card(p) {
    return '<article class="product-card" data-category="' + esc(p.division) + '" data-aos="fade-up">' +
      '<a class="product-media product-link" href="product-details.html?slug=' + encodeURIComponent(p.slug) + '" aria-label="View details of ' + esc(p.name) + '">' +
        '<span class="product-category">' + esc(p.division) + '</span>' +
        '<img src="' + esc(p.image) + '" loading="lazy" alt="' + esc(p.alt || p.name) + '">' +
      '</a>' +
      '<div class="product-body">' +
        '<h4 class="product-title"><a class="product-title-link" href="product-details.html?slug=' + encodeURIComponent(p.slug) + '">' + esc(p.name) + '</a></h4>' +
        '<p class="product-tagline">' + esc(p.tagline) + '</p>' +
        '<div class="product-specs"><div><b>Composition</b> ' + esc(p.composition) + '</div><div><b>Pack Size</b> ' + esc(p.packSize) + '</div></div>' +
        '<div class="product-actions"><a class="product-btn" href="product-details.html?slug=' + encodeURIComponent(p.slug) + '">View full details <i class="bi bi-arrow-up-right"></i></a>' +
        '<a class="product-whatsapp" href="' + esc(wa(p.name)) + '" target="_blank" rel="noopener" aria-label="Enquire about ' + esc(p.name) + ' on WhatsApp"><i class="fab fa-whatsapp"></i></a></div>' +
      '</div></article>';
  }

  function init(opts) {
    opts = opts || {};
    var grid = document.getElementById(opts.gridId || 'product-grid');
    if (!grid) return;
    var division = opts.division || 'all';
    var search = document.getElementById(opts.searchId || 'productSearch');
    var count = document.getElementById(opts.countId || 'productCount');
    var load = document.getElementById(opts.loadId || 'loadMoreProducts');
    var empty = document.getElementById(opts.emptyId || 'productEmptyState');
    var filters = Array.prototype.slice.call(document.querySelectorAll(opts.filterSelector || '.filter-btn'));
    var visible = PAGE_SIZE, query = '', active = division;

    function matches(p) {
      if (active !== 'all' && p.division !== active) return false;
      var hay = [p.name, p.tagline, p.composition, p.packSize, p.description, p.division, p.form, (p.indications || []).join(' ')].join(' ').toLowerCase();
      return !query || hay.indexOf(query) !== -1;
    }
    function render() {
      var matchesList = products.filter(matches);
      var shown = matchesList.slice(0, visible);
      grid.innerHTML = shown.map(card).join('');
      if (count) {
        var start = shown.length ? 1 : 0;
        count.textContent = matchesList.length ? ('Showing ' + start + '–' + shown.length + ' of ' + matchesList.length + ' products') : 'Showing 0 of 0 products';
      }
      if (empty) empty.classList.toggle('is-visible', matchesList.length === 0);
      if (load) load.classList.toggle('is-hidden', shown.length >= matchesList.length);
      if (window.NevixaAOS) window.NevixaAOS.refresh();
    }
    filters.forEach(function (btn) { btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); }); btn.classList.add('active'); active = btn.dataset.filter || 'all'; visible = PAGE_SIZE; render();
    }); });
    if (search) search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); visible = PAGE_SIZE; render(); });
    if (load) load.addEventListener('click', function () { visible += PAGE_SIZE; render(); });
    render();
  }
  window.NevixaProducts = { init: init };
})();
