/* Kofi Part 3 - interactive functionality */
document.addEventListener("DOMContentLoaded", () => {
  const products = [...document.querySelectorAll(".menu-item")];

  // Search and sort products dynamically.
  const search = document.querySelector("#menuSearch");
  const clear = document.querySelector("#clearSearch");
  const sort = document.querySelector("#sortProducts");
  const searchMessage = document.querySelector("#searchMessage");
  function filterProducts() {
    const term = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    products.forEach(card => {
      const matches = card.textContent.toLowerCase().includes(term);
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (searchMessage) searchMessage.textContent = `${visible} product${visible === 1 ? "" : "s"} found.`;
  }
  search?.addEventListener("input", filterProducts);
  document.querySelector("#menuSearchForm")?.addEventListener("submit", e => { e.preventDefault(); filterProducts(); });
  clear?.addEventListener("click", () => { search.value = ""; filterProducts(); search?.focus(); });
  sort?.addEventListener("change", () => {
    const container = document.querySelector("#menuItems");
    if (!container) return;
    const sorted = [...products].sort((a,b) => {
      const pa = Number(a.dataset.price || 0), pb = Number(b.dataset.price || 0);
      return sort.value === "price-low" ? pa-pb : sort.value === "price-high" ? pb-pa : a.dataset.name.localeCompare(b.dataset.name);
    });
    sorted.forEach(card => container.appendChild(card));
  });

  // Lightweight shopping cart: session-only, no payment processing.
  const cart = [];
  const cartOutput = document.querySelector("#cartStatus");
  products.forEach(card => {
    const button = card.querySelector("button");
    if (!button) return;
    button.addEventListener("click", () => {
      const name = card.querySelector("h3")?.textContent.trim() || "Product";
      const price = Number(card.dataset.price || 0);
      cart.push({name, price});
      if (cartOutput) cartOutput.textContent = `Cart: ${cart.length} item(s) — Total R${cart.reduce((s,x)=>s+x.price,0).toFixed(2)}`;
      button.textContent = "Added ✓";
      setTimeout(() => button.textContent = "Add to Cart", 1000);
    });
  });

  // Click product images to open accessible lightbox.
  const lightbox = document.querySelector("#imageLightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const closeLightbox = () => { if (lightbox) { lightbox.hidden = true; document.body.style.overflow = ""; } };
  products.forEach(card => card.querySelector("img")?.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = card.querySelector("img").src;
    lightboxImage.alt = card.querySelector("img").alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector("button")?.focus();
  }));
  lightbox?.querySelector("button")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // Accessible FAQ accordions.
  document.querySelectorAll(".accordion-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  // Client-side enquiry validation and indicative response.
  const enquiry = document.querySelector("#enquiryForm");
  enquiry?.addEventListener("submit", e => {
    e.preventDefault();
    const response = document.querySelector("#enquiryResponse");
    if (!enquiry.reportValidity()) return;
    const type = document.querySelector("#enquiryType")?.value;
    const date = document.querySelector("#preferredDate")?.value;
    const message = type === "catering"
      ? "Thank you. Catering availability and pricing depend on guest numbers and date. Our team will contact you to confirm a quotation."
      : type === "special-order"
      ? "Thank you. Special orders are subject to ingredient and preparation availability. Our team will confirm the details with you."
      : "Thank you for your enquiry. The displayed menu prices are indicative; our team will confirm current availability.";
    response.textContent = message + (date ? ` Requested date: ${date}.` : "");
    response.setAttribute("role", "status");
    enquiry.reset();
  });

  // Contact form validates, then opens the visitor's email application.
  // This static site has no server endpoint; mailto does not send automatically.
  const contact = document.querySelector("#contactForm");
  contact?.addEventListener("submit", e => {
    e.preventDefault();
    if (!contact.reportValidity()) return;
    const get = id => document.getElementById(id)?.value.trim() || "";
    const subject = encodeURIComponent(`[Kofi website] ${get("contactType")}: ${get("contactSubject")}`);
    const body = encodeURIComponent(
      `Name: ${get("contactName")}\nEmail: ${get("contactEmail")}\nMessage type: ${get("contactType")}\n\n${get("contactMessage")}`
    );
    document.querySelector("#contactResponse").textContent = "Your email application should open with the message prepared. Please review and press Send.";
    window.location.href = `mailto:hello@kofi.co.za?subject=${subject}&body=${body}`;
  });
});
