
/* =========================================
   KOFI COFFEE SHOP
   Website JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Automatic copyright year
    const currentYear = new Date().getFullYear();

    [
        "copyrightYear",
        "homeCopyrightYear",
        "enquiryCopyrightYear",
        "contactCopyrightYear"
    ].forEach(function (id) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = currentYear;
        }
    });


    // 2. Product search, filtering and sorting
    const menuItems = document.getElementById("menuItems");
    const searchInput = document.getElementById("menuSearch");
    const clearSearch = document.getElementById("clearSearch");
    const sortSelect = document.getElementById("sortProducts");
    const searchMessage = document.getElementById("searchMessage");

    if (menuItems) {

        function getProducts() {
            return Array.from(menuItems.querySelectorAll(".menu-item"));
        }

        function filterProducts() {
            const searchTerm = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            let visibleCount = 0;

            getProducts().forEach(function (product) {
                const productName = product.dataset.name ||
                    product.textContent;

                const matches = productName
                    .toLowerCase()
                    .includes(searchTerm);

                product.hidden = !matches;

                if (matches) {
                    visibleCount++;
                }
            });

            if (searchMessage) {
                searchMessage.textContent = visibleCount +
                    (visibleCount === 1
                        ? " product found."
                        : " products found.");
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", filterProducts);
        }

        if (clearSearch) {
            clearSearch.addEventListener("click", function () {
                if (searchInput) {
                    searchInput.value = "";
                }

                filterProducts();

                if (searchInput) {
                    searchInput.focus();
                }
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                const products = getProducts();

                products.sort(function (a, b) {
                    const nameA = (a.dataset.name || "").toLowerCase();
                    const nameB = (b.dataset.name || "").toLowerCase();

                    const priceA = Number(a.dataset.price || 0);
                    const priceB = Number(b.dataset.price || 0);

                    switch (sortSelect.value) {
                        case "name":
                            return nameA.localeCompare(nameB);

                        case "price-low":
                            return priceA - priceB;

                        case "price-high":
                            return priceB - priceA;

                        default:
                            return 0;
                    }
                });

                products.forEach(function (product) {
                    menuItems.appendChild(product);
                });

                filterProducts();
            });
        }

        filterProducts();
    }


    // 3. Shopping cart demonstration
    const cartStatus = document.getElementById("cartStatus");

    let cartCount = 0;
    let cartTotal = 0;

    document.querySelectorAll(".menu-item").forEach(function (product) {
        const addButton = product.querySelector("button");

        if (!addButton) {
            return;
        }

        addButton.addEventListener("click", function () {
            const price = Number(product.dataset.price || 0);
            const productName = product.dataset.name || "Product";

            if (!Number.isFinite(price) || price <= 0) {
                return;
            }

            cartCount++;
            cartTotal += price;

            if (cartStatus) {
                cartStatus.textContent =
                    productName + " added to your cart. " +
                    "Items: " + cartCount +
                    " | Total: R" + cartTotal.toFixed(2);
            }
        });
    });


    // 4. Product image lightbox
    const lightbox = document.getElementById("imageLightbox");

    if (lightbox) {
        const lightboxImage = lightbox.querySelector("img");
        const closeButton = lightbox.querySelector("button");
        let previousFocus = null;

        function openLightbox(image) {
            if (!lightboxImage) {
                return;
            }

            previousFocus = image;
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.style.display = "flex";
            lightbox.setAttribute("aria-hidden", "false");

            if (closeButton) {
                closeButton.focus();
            }
        }

        function closeLightbox() {
            lightbox.style.display = "none";
            lightbox.setAttribute("aria-hidden", "true");

            if (lightboxImage) {
                lightboxImage.removeAttribute("src");
            }

            if (previousFocus) {
                previousFocus.focus();
            }
        }

        document.querySelectorAll(".menu-item img").forEach(function (image) {
            image.addEventListener("click", function () {
                openLightbox(image);
            });

            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");

            image.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
        });

        if (closeButton) {
            closeButton.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                lightbox.style.display === "flex"
            ) {
                closeLightbox();
            }
        });
    }


    // 5. FAQ accordion
    document.querySelectorAll(".accordion-trigger").forEach(function (button) {

        button.addEventListener("click", function () {
            const panelId = button.getAttribute("aria-controls");
            const panel = panelId
                ? document.getElementById(panelId)
                : null;

            if (!panel) {
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isExpanded));
            panel.hidden = isExpanded;
        });

    });


    // 6. Enquiry form validation and response
    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        const enquiryResponse =
            document.getElementById("enquiryResponse");

        const preferredDate =
            document.getElementById("preferredDate");

        if (preferredDate) {
            const today = new Date();
            const localDate = new Date(
                today.getTime() - today.getTimezoneOffset() * 60000
            ).toISOString().split("T")[0];

            preferredDate.min = localDate;
        }

        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!enquiryForm.reportValidity()) {
                return;
            }

            const websiteField = document.getElementById("website");

            // Honeypot spam check
            if (websiteField && websiteField.value.trim() !== "") {
                return;
            }

            const enquiryType =
                document.getElementById("enquiryType");

            const selectedType = enquiryType
                ? enquiryType.value
                : "";

            const responses = {
                menu: "Thank you for asking about our menu. Please contact Kofi for the latest menu and prices.",
                catering: "Thank you for your catering enquiry. Our team will need to confirm availability and pricing.",
                "special-order": "Thank you for your special-order enquiry. Please contact us to discuss your requirements.",
                feedback: "Thank you for sharing your feedback with Kofi.",
                volunteering: "Thank you for your interest. Please contact Kofi for more information.",
                sponsorship: "Thank you for your sponsorship enquiry. Please contact our team for further discussion.",
                other: "Thank you for contacting Kofi. Your enquiry has been prepared for review."
            };

            if (enquiryResponse) {
                enquiryResponse.textContent =
                    (responses[selectedType] ||
                    "Thank you for your enquiry.") +
                    " This is a demonstration form; your information has not been sent or saved.";
            }

            enquiryForm.reset();

            if (preferredDate) {
                const today = new Date();
                preferredDate.min = new Date(
                    today.getTime() - today.getTimezoneOffset() * 60000
                ).toISOString().split("T")[0];
            }
        });
    }


    // 7. Contact form: prepare an email
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const contactResponse =
            document.getElementById("contactResponse");

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const phone = document.getElementById("contactPhone");
            const type = document.getElementById("contactType").value;
            const subject = document.getElementById("contactSubject").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            const phoneValue = phone ? phone.value.trim() : "";

            const emailSubject = encodeURIComponent(
                subject || "Kofi Coffee Shop Contact Message"
            );

            const emailBody = encodeURIComponent(
                "Name: " + name + "\n" +
                "Email: " + email + "\n" +
                "Phone: " + (phoneValue || "Not provided") + "\n" +
                "Message type: " + type + "\n\n" +
                "Message:\n" + message
            );

            const recipient = "hello@kofi.co.za";

            if (contactResponse) {
                contactResponse.textContent =
                    "Your email application should open. Please review the message and press Send. If it does not open, email " +
                    recipient + " directly.";
            }

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + emailSubject +
                "&body=" + emailBody;
        });
    }


    // 8. Contact map (requires Leaflet and verified coordinates)
    const mapElement = document.getElementById("kofiMap");

    if (mapElement && typeof L !== "undefined") {
        // Replace these example coordinates with the verified
        // physical location of Kofi Coffee Shop before publishing.
        const latitude = -25.7479;
        const longitude = 28.2293;

        const map = L.map("kofiMap").setView(
            [latitude, longitude],
            14
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Kofi Coffee Shop")
            .openPopup();
    }

});
==========================
