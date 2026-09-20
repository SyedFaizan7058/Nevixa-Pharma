document.addEventListener("DOMContentLoaded", function () {
    const products = Array.isArray(window.NEVIXA_PRODUCTS) ? window.NEVIXA_PRODUCTS : [];
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const skeleton = document.getElementById("pdSkeleton");
    const mainContent = document.getElementById("main-content");
    const detail = document.getElementById("productDetail");
    const structuredContent = document.getElementById("productStructuredContent");
    const notFound = document.getElementById("productNotFound");
    const relatedSection = document.getElementById("relatedProductsSection");
    const relatedGrid = document.getElementById("relatedProductsGrid");
    const relatedDivisionName = document.getElementById("relatedDivisionName");
    const sectionNav = document.getElementById("pdSectionNav");

    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[ch]));

    const slugFor = product => product.slug || product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const product = products.find(item => item.slug === slug);

    if (!product) {
        if (skeleton) skeleton.hidden = true;
        if (mainContent) mainContent.hidden = false;
        if (detail) detail.hidden = true;
        if (structuredContent) structuredContent.hidden = true;
        if (relatedSection) relatedSection.hidden = true;
        if (sectionNav) sectionNav.hidden = true;
        const distSection = document.getElementById("section-distribution");
        if (distSection) distSection.hidden = true;
        if (notFound) notFound.hidden = false;
        document.title = "Product Not Found | Nevixa Pharma";
        return;
    }

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    };

    const divisionCap = product.division.charAt(0).toUpperCase() + product.division.slice(1).toLowerCase();
    const divisionCleanUrl = `${product.division}_division.html`;
    const pageCanonicalUrl = `https://nevixapharma.com/product-details.html?slug=${encodeURIComponent(product.slug)}`;
    const pageImageUrl = new URL(product.image, document.baseURI).href;

    // 1. Dynamic Document Title
    if (product.indications && product.indications.length > 0) {
        document.title = `${product.name} — Uses, Composition & Product Info | Nevixa Pharma`;
    } else {
        document.title = `${product.name} — Composition & Product Info | Nevixa Pharma`;
    }

    // 2. Dynamic Meta Description
    const indicationsSnippet = product.indications && product.indications.length > 0
        ? ` Formulated for ${product.indications.slice(0, 3).join(', ')}.`
        : '';
    const metaDescription = `${product.name} (${product.form || 'Formulation'}) by Nevixa Pharma: ${product.composition || ''} (${product.packSize || ''}).${indicationsSnippet} View verified indications, formulation specs & distribution enquiry.`;

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) metaDescTag.content = metaDescription;

    // 3. Canonical Tag
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) canonicalTag.href = pageCanonicalUrl;

    // 4. Open Graph & Twitter Cards
    const updateMetaProp = (prop, val) => {
        const tag = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
        if (tag) tag.setAttribute('content', val);
    };
    updateMetaProp('og:title', `${product.name} | Nevixa Pharma`);
    updateMetaProp('og:description', metaDescription);
    updateMetaProp('og:url', pageCanonicalUrl);
    updateMetaProp('og:image', pageImageUrl);
    updateMetaProp('twitter:title', `${product.name} | Nevixa Pharma`);
    updateMetaProp('twitter:description', metaDescription);
    updateMetaProp('twitter:image', pageImageUrl);

    // 5. Breadcrumb Navigation
    setText("breadcrumbProduct", product.name);
    const breadcrumbDivLink = document.getElementById("breadcrumbDivisionLink");
    if (breadcrumbDivLink) {
        breadcrumbDivLink.textContent = `${divisionCap} Division`;
        breadcrumbDivLink.href = divisionCleanUrl;
    }

    // 6. Header Hero Elements
    setText("productDivision", `${divisionCap} Division`);
    setText("productFormBadge", product.form || "Formulation");
    setText("productName", product.name);
    setText("productTagline", product.tagline || "");
    setText("productForm", product.form || "Pharmaceutical Formulation");
    setText("productPackSize", product.packSize || "Standard Pack");
    setText("productComposition", product.composition || "Verified Formulation");

    // Product Image
    const image = document.getElementById("productImage");
    if (image) {
        image.src = product.image;
        image.alt = product.alt || `${product.name} by Nevixa Pharma`;
        image.loading = "eager";
        image.decoding = "async";
        image.onerror = function () {
            const wrap = this.closest(".product-detail-image") || this.closest(".pd-image-frame");
            if (wrap) wrap.classList.add("image-error");
        };
    }

    // WhatsApp CTAs
    const whatsappMsg = `Hello Nevixa Pharma, I would like to enquire about ${product.name} (${product.composition || ''}).`;
    const whatsappEncodedUrl = `https://wa.me/919326095981?text=${encodeURIComponent(whatsappMsg)}`;

    const whatsappBtn = document.getElementById("whatsappProductBtn");
    const whatsappBtnText = document.getElementById("whatsappBtnText");
    if (whatsappBtn) {
        whatsappBtn.href = whatsappEncodedUrl;
        if (whatsappBtnText) {
            whatsappBtnText.textContent = `Enquire on WhatsApp`;
        }
    }

    const whatsappProcureBtn = document.getElementById("whatsappProcurementBtn");
    if (whatsappProcureBtn) {
        const procureMsg = `Hello Nevixa Pharma, I am interested in procuring / distributing ${product.name}.`;
        whatsappProcureBtn.href = `https://wa.me/919326095981?text=${encodeURIComponent(procureMsg)}`;
    }

    // 7. Structured In-Depth Product Sections
    setText("productDescription", product.description);

    // Indications / Uses Section (AEO Answer Box)
    const indicationsCard = document.getElementById("indicationsCard");
    const indicationsHeading = document.getElementById("indicationsHeading");
    const indicationsLead = document.getElementById("indicationsLead");
    const indicationsList = document.getElementById("indicationsList");
    const navItemUses = document.getElementById("navItemUses");
    const dividerUses = document.getElementById("dividerUses");

    if (product.indications && product.indications.length > 0) {
        if (indicationsCard) indicationsCard.hidden = false;
        if (indicationsHeading) indicationsHeading.textContent = `What is ${product.name} used for?`;
        if (indicationsLead) indicationsLead.textContent = `${product.name} is formulated to support therapeutic and wellness requirements including:`;
        if (indicationsList) {
            indicationsList.innerHTML = product.indications.map(ind =>
                `<span class="indication-pill"><i class="bi bi-check2" aria-hidden="true"></i> ${escapeHtml(ind)}</span>`
            ).join('');
        }
    } else {
        if (indicationsCard) indicationsCard.hidden = true;
        if (navItemUses) navItemUses.hidden = true;
        if (dividerUses) dividerUses.hidden = true;
    }

    // Key Highlights Section
    const highlightsCard = document.getElementById("highlightsCard");
    const highlightsList = document.getElementById("highlightsList");
    const navItemHighlights = document.getElementById("navItemHighlights");
    const dividerHighlights = document.getElementById("dividerHighlights");

    if (product.keyHighlights && product.keyHighlights.length > 0) {
        if (highlightsCard) highlightsCard.hidden = false;
        if (highlightsList) {
            highlightsList.innerHTML = product.keyHighlights.map(hl =>
                `<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <span>${escapeHtml(hl)}</span></li>`
            ).join('');
        }
    } else {
        if (highlightsCard) highlightsCard.hidden = true;
        if (navItemHighlights) navItemHighlights.hidden = true;
        if (dividerHighlights) dividerHighlights.hidden = true;
    }

    // 8. Related Products
    const related = products
        .filter(item => item.division === product.division && item.slug !== product.slug)
        .slice(0, 4);

    const navItemRelated = document.getElementById("navItemRelated");

    if (related.length && relatedSection && relatedGrid) {
        relatedSection.hidden = false;
        if (navItemRelated) navItemRelated.hidden = false;
        if (relatedDivisionName) relatedDivisionName.textContent = divisionCap;
        const relatedViewAll = document.getElementById("relatedViewAllLink");
        if (relatedViewAll) relatedViewAll.href = divisionCleanUrl;

        relatedGrid.innerHTML = related.map(item => {
            const itemSlug = slugFor(item);
            return `
                <article class="product-card">
                    <a class="product-media" href="product-details.html?slug=${encodeURIComponent(itemSlug)}"
                       aria-label="View details for ${escapeHtml(item.name)}">
                        <span class="product-category">${escapeHtml(item.division)}</span>
                        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.name + ' by Nevixa Pharma')}" loading="lazy" decoding="async">
                    </a>
                    <div class="product-body">
                        <h3 class="product-title">${escapeHtml(item.name)}</h3>
                        <p class="product-tagline">${escapeHtml(item.tagline || '')}</p>
                        <div class="product-specs">
                            <div><b>Composition</b><span>${escapeHtml(item.composition || '')}</span></div>
                            <div><b>Pack Size</b><span>${escapeHtml(item.packSize || '')}</span></div>
                        </div>
                        <a class="product-btn" href="product-details.html?slug=${encodeURIComponent(itemSlug)}">
                            View details <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </article>
            `;
        }).join("");
    } else {
        if (relatedSection) relatedSection.hidden = true;
        if (navItemRelated) navItemRelated.hidden = true;
    }

    // 9. Schema.org Structured Data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "name": `${product.name} | Nevixa Pharma`,
        "description": metaDescription,
        "url": pageCanonicalUrl,
        "image": pageImageUrl,
        "isPartOf": {
            "@type": "WebSite",
            "name": "Nevixa Pharma",
            "url": "https://nevixapharma.com"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://nevixapharma.com/index.html"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": `${divisionCap} Division`,
                    "item": `https://nevixapharma.com/${divisionCleanUrl}`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.name,
                    "item": pageCanonicalUrl
                }
            ]
        }
    };

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(schemaScript);

    // 10. Reveal skeleton -> main content transition
    if (skeleton) skeleton.hidden = true;
    if (mainContent) mainContent.hidden = false;

    // 11. Accordion interaction
    const accordionBtns = document.querySelectorAll(".pd-accordion-btn");
    accordionBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const isExpanded = this.getAttribute("aria-expanded") === "true";
            const targetId = this.getAttribute("aria-controls");
            const targetPanel = document.getElementById(targetId);

            this.setAttribute("aria-expanded", String(!isExpanded));
            if (targetPanel) {
                targetPanel.classList.toggle("is-open", !isExpanded);
            }
        });
    });

    // 12. Accessible Mobile Tabs (<768px) & Desktop Scroll-Spy (>=768px)
    const tabButtons = Array.from(document.querySelectorAll("#pdNavList button[role='tab']"));
    const tabPanels = Array.from(document.querySelectorAll(".pd-tabpanel"));

    const tabTargetMap = {
        'overview': 'section-overview',
        'uses': 'section-uses',
        'highlights': 'section-highlights',
        'directions': 'section-directions',
        'safety': 'section-storage',
        'storage': 'section-storage',
        'related': 'relatedProductsSection',
        'related-product': 'relatedProductsSection',
        'related-products': 'relatedProductsSection'
    };

    function activateTab(targetId, updateHash = false) {
        const isMobile = window.innerWidth < 768;

        // Find button corresponding to targetId
        const activeBtn = tabButtons.find(btn => btn.getAttribute("data-target") === targetId);
        if (!activeBtn) return;

        tabButtons.forEach(btn => {
            const isMatch = btn === activeBtn;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-selected", String(isMatch));
            btn.setAttribute("tabindex", isMatch ? "0" : "-1");
        });

        // Ensure active tab button is visible in horizontal scroll container
        try {
            activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        } catch (_) {}

        if (isMobile) {
            tabPanels.forEach(panel => {
                const isMatch = panel.id === targetId;
                panel.classList.toggle("is-active-tab", isMatch);
                if (isMatch) {
                    panel.focus({ preventScroll: true });
                }
            });

            if (updateHash) {
                // Find primary hash key
                for (const [key, val] of Object.entries(tabTargetMap)) {
                    if (val === targetId && key !== 'storage' && key !== 'related-product' && key !== 'related-products') {
                        history.replaceState(null, '', '#' + key);
                        break;
                    }
                }
            }
        } else {
            // On desktop/tablet, smooth scroll to section
            const targetEl = document.getElementById(targetId);
            if (targetEl && updateHash) {
                const headerOffset = 150;
                const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - headerOffset,
                    behavior: "smooth"
                });
            }
        }
    }

    // Attach click listeners to tabs
    tabButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            activateTab(targetId, true);
        });
    });

    // Keyboard navigation between tabs (ArrowLeft / ArrowRight)
    const tabList = document.getElementById("pdNavList");
    if (tabList) {
        tabList.addEventListener("keydown", function (e) {
            const visibleButtons = tabButtons.filter(b => !b.closest("li").hidden);
            const currentIndex = visibleButtons.indexOf(document.activeElement);

            if (currentIndex === -1) return;

            let nextIndex = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                nextIndex = (currentIndex + 1) % visibleButtons.length;
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                nextIndex = (currentIndex - 1 + visibleButtons.length) % visibleButtons.length;
            } else if (e.key === "Home") {
                nextIndex = 0;
            } else if (e.key === "End") {
                nextIndex = visibleButtons.length - 1;
            }

            if (nextIndex !== null) {
                e.preventDefault();
                const nextBtn = visibleButtons[nextIndex];
                nextBtn.focus();
                activateTab(nextBtn.getAttribute("data-target"), true);
            }
        });
    }

    // Check initial hash (e.g. #uses, #highlights, #directions, #safety, #related)
    function applyHashOrInitial() {
        const rawHash = (window.location.hash || "").replace("#", "").toLowerCase();
        let targetId = tabTargetMap[rawHash];

        // If target exists and not hidden
        if (targetId) {
            const panel = document.getElementById(targetId);
            if (panel && !panel.hidden) {
                activateTab(targetId, false);
                return;
            }
        }

        // Default to Overview
        activateTab("section-overview", false);
    }

    applyHashOrInitial();

    window.addEventListener("hashchange", applyHashOrInitial);

    // On window resize across 768px, sync view
    let wasMobile = window.innerWidth < 768;
    window.addEventListener("resize", function () {
        const isMobile = window.innerWidth < 768;
        if (isMobile !== wasMobile) {
            wasMobile = isMobile;
            if (isMobile) {
                applyHashOrInitial();
            } else {
                tabPanels.forEach(p => p.classList.remove("is-active-tab"));
            }
        }
    }, { passive: true });

    // Desktop scroll-spy
    const sectionsToSpy = [
        document.getElementById("section-overview"),
        document.getElementById("section-uses"),
        document.getElementById("section-highlights"),
        document.getElementById("section-directions"),
        document.getElementById("section-storage"),
        document.getElementById("relatedProductsSection")
    ].filter(Boolean);

    function updateDesktopScrollSpy() {
        if (window.innerWidth < 768) return;

        const scrollPosition = window.scrollY + 180;
        let currentSectionId = "";

        for (let i = sectionsToSpy.length - 1; i >= 0; i--) {
            const section = sectionsToSpy[i];
            if (section && !section.hidden && section.offsetHeight > 0) {
                const top = section.offsetTop;
                if (scrollPosition >= top) {
                    currentSectionId = section.id;
                    break;
                }
            }
        }

        if (!currentSectionId && sectionsToSpy.length > 0) {
            currentSectionId = sectionsToSpy[0].id;
        }

        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute("data-target") === currentSectionId;
            btn.classList.toggle("is-active", isMatch);
            btn.setAttribute("aria-selected", String(isMatch));
        });
    }

    window.addEventListener("scroll", updateDesktopScrollSpy, { passive: true });

    // 13. Reveal observer
    const revealEls = document.querySelectorAll(".pd-reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("is-visible"));
    }

    // 14. Refresh AOS animations if active
    if (window.NevixaAOS) window.NevixaAOS.refresh();
});
