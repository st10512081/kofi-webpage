
/* ==========================================
   KOFI COFFEE SHOP - PART 3 JAVASCRIPT
   Search, sorting, cart, lightbox, FAQ,
   enquiry form, contact form and map.
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. PRODUCT SEARCH AND SORTING
    // ==========================================

    const products = [...document.querySelectorAll(".menu-item")];

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

        if (searchMessage) {
            searchMessage.textContent =
                `${visible} product${visible === 1 ? "" : "s"} found.`;
        }
    }

    search?.addEventListener("input", filterProducts);

    document.querySelector("#menuSearchForm")?.addEventListener("submit", event => {

        event.preventDefault();
        filterProducts();

    });

    clear?.addEventListener("click", () => {

        if (search) {
            search.value = "";
            filterProducts();
            search.focus();
        }

    });

    sort?.addEventListener("change", () => {

        const container = document.querySelector("#menuItems");

        if (!container) return;

        const sorted = [...products].sort((a, b) => {

            const priceA = Number(a.dataset.price || 0);
            const priceB = Number(b.dataset.price || 0);

            if (sort.value === "price-low") {
                return priceA - priceB;
            }

            if (sort.value === "price-high") {
                return priceB - priceA;
            }

            const nameA = a.dataset.name || "";
            const nameB = b.dataset.name || "";

            return nameA.localeCompare(nameB);

        });

        sorted.forEach(card => container.appendChild(card));

    });


    // ==========================================
    // 2. SHOPPING CART
    // ==========================================

    const cart = [];

    const cartOutput = document.querySelector("#cartStatus");

    products.forEach(card => {

        const button = card.querySelector("button");

        if (!button) return;

        button.addEventListener("click", () => {

            const name =
                card.querySelector("h3")?.textContent.trim() || "Product";

            const price = Number(card.dataset.price || 0);

            cart.push({ name, price });

            if (cartOutput) {

                const total = cart.reduce(
                    (sum, item) => sum + item.price,
                    0
                );

                cartOutput.textContent =
                    `Cart: ${cart.length} item(s) — Total R${total.toFixed(2)}`;

            }

            button.textContent = "Added ✓";

            setTimeout(() => {
                button.textContent = "Add to Cart";
            }, 1000);

        });

    });


    // ==========================================
    // 3. PRODUCT IMAGE LIGHTBOX
    // ==========================================

    const lightbox = document.querySelector("#imageLightbox");

    const lightboxImage = lightbox?.querySelector("img");

    const closeLightbox = () => {

        if (lightbox) {

            lightbox.hidden = true;
            document.body.style.overflow = "";

        }

    };

    products.forEach(card => {

        const image = card.querySelector("img");

        image?.addEventListener("click", () => {

            if (!lightbox || !lightboxImage) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.hidden = false;

            document.body.style.overflow = "hidden";

            lightbox.querySelector("button")?.focus();

        });

    });

    lightbox?.querySelector("button")?.addEventListener(
        "click",
        closeLightbox
    );

    lightbox?.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeLightbox();
        }

    });


    // ==========================================
    // 4. FAQ ACCORDION
    // ==========================================

    document.querySelectorAll(".accordion-trigger").forEach(trigger => {

        trigger.addEventListener("click", () => {

            const panel = document.getElementById(
                trigger.getAttribute("aria-controls")
            );

            const expanded =
                trigger.getAttribute("aria-expanded") === "true";

            trigger.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            if (panel) {
                panel.hidden = expanded;
            }

        });

    });


    // ==========================================
    // 5. ENQUIRY FORM
    // ==========================================

    const enquiry = document.querySelector("#enquiryForm");

    const enquiryResponse = document.querySelector("#enquiryResponse");

    const preferredDate = document.querySelector("#preferredDate");


    // Automatically prevent visitors from selecting past dates.
    if (preferredDate) {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(today.getMonth() + 1).padStart(2, "0");

        const day = String(today.getDate()).padStart(2, "0");

        preferredDate.min = `${year}-${month}-${day}`;

    }


    enquiry?.addEventListener("submit", event => {

        event.preventDefault();

        // Check the hidden honeypot field for spam.
        const honeypot = document.querySelector("#website");

        if (honeypot && honeypot.value.trim() !== "") {

            if (enquiryResponse) {
                enquiryResponse.textContent =
                    "Your submission could not be processed.";
            }

            return;

        }


        // Check built-in HTML form validation.
        if (!enquiry.reportValidity()) {
            return;
        }


        // Read and validate the visitor's details.
        const name = document.querySelector("#name")?.value.trim() || "";

        const email = document.querySelector("#email")?.value.trim() || "";

        const message = document.querySelector("#message")?.value.trim() || "";

        const type = document.querySelector("#enquiryType")?.value || "";

        const date = preferredDate?.value || "";


        // Additional JavaScript validation.
        if (name.length < 2 || email === "" || message.length < 10) {

            if (enquiryResponse) {
                enquiryResponse.textContent =
                    "Please enter a valid name, email address and enquiry message.";
            }

            return;

        }


        // Display a response depending on the enquiry type.
        let responseMessage;

        if (type === "catering") {

            responseMessage =
                "Thank you! Catering availability and pricing depend on guest numbers and your selected date. Our team would need to confirm a quotation.";

        } else if (type === "special-order") {

            responseMessage =
                "Thank you! Special orders depend on ingredient and preparation availability. Our team would need to confirm the details.";

        } else {

            responseMessage =
                "Thank you for your enquiry! Our team would need to review your request and confirm availability.";

        }


        if (enquiryResponse) {

            enquiryResponse.textContent =
                responseMessage + (date ? ` Requested date: ${date}.` : "") +
                " This demonstration form does not send enquiries yet.";

        }

    });


    // Clear the enquiry response when the visitor resets the form.
    enquiry?.addEventListener("reset", () => {

        setTimeout(() => {

            if (enquiryResponse) {
                enquiryResponse.textContent = "";
            }

        }, 0);

    });


    // ==========================================
    // 6. CONTACT FORM
    // ==========================================

    const contact = document.querySelector("#contactForm");

    contact?.addEventListener("submit", event => {

        event.preventDefault();

        if (!contact.reportValidity()) {
            return;
        }

        const get = id =>
            document.getElementById(id)?.value.trim() || "";

        const name = get("contactName");

        const email = get("contactEmail");

        const message = get("contactMessage");

        const type = get("contactType");

        const subjectText = get("contactSubject");


        // Additional checks for empty spaces.
        if (name.length < 2 || email === "" || message.length < 10) {

            const response = document.querySelector("#contactResponse");

            if (response) {
                response.textContent =
                    "Please check your name, email address and message.";
            }

            return;

        }


        const subject = encodeURIComponent(
            `[Kofi website] ${type}: ${subjectText}`
        );

        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Message type: ${type}\n\n` +
            `${message}`
        );


        const response = document.querySelector("#contactResponse");

        if (response) {

            response.textContent =
                "Your email application should open with your message prepared. Please review it and press Send.";

        }

        // Opens the visitor's default email application.
        window.location.href =
            `mailto:hello@kofi.co.za?subject=${subject}&body=${body}`;

    });


    // ==========================================
    // 7. CONTACT PAGE INTERACTIVE MAP
    // ==========================================

    const mapElement = document.querySelector("#kofiMap");

    if (mapElement) {

        if (typeof L !== "undefined") {

            const kofiMap = L.map("kofiMap").setView(
                [-25.7475, 28.2135],
                13
            );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

                    maxZoom: 19
                }
            ).addTo(kofiMap);


            // Approximate Pretoria Central area.
            const pretoriaMarker = L.marker(
                [-25.7460, 28.1880]
            ).addTo(kofiMap);

            pretoriaMarker.bindPopup(
                "<strong>Kofi Main Store</strong><br>Pretoria Central, Gauteng."
            );


            // Approximate Hatfield area.
            const hatfieldMarker = L.marker(
                [-25.7460, 28.2380]
            ).addTo(kofiMap);

            hatfieldMarker.bindPopup(
                "<strong>Kofi City Branch</strong><br>Hatfield, Pretoria."
            );


            const locationBounds = L.latLngBounds(
                [-25.7460, 28.1880],
                [-25.7460, 28.2380]
            );

            kofiMap.fitBounds(locationBounds, {
                padding: [30, 30]
            });

        } else {

            mapElement.textContent =
                "The interactive map could not load. Please use the Google Maps links above.";

        }

    }


    // ==========================================
    // 8. DYNAMIC COPYRIGHT YEAR
    // ==========================================

    const copyrightIds = [
        "copyrightYear",
        "enquiryCopyrightYear",
        "contactCopyrightYear"
    ];

    copyrightIds.forEach(id => {

        const yearElement = document.getElementById(id);

        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

    });

});

// ==========================================
// END OF KOFI PART 3 JAVASCRIPT
// ==========================================
