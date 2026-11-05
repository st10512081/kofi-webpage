
/* =========================================================
   KOFI COFFEE SHOP
   COMPLETE WEBSITE JAVASCRIPT
   Features:
   1. Copyright year
   2. Product search
   3. Autocomplete suggestions
   4. Clear search
   5. Close suggestions
   6. Sort products
   7. Explore menu navigation
   8. Shopping cart
   9. Local storage
   10. Checkout demonstration
   11. Product image lightbox
   12. FAQ accordion
   13. Client-side form validation
   14. Form error handling
   15. AJAX form submission
   16. Leaflet map
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. COPYRIGHT YEAR
       ===================================================== */

    const copyrightYear = document.getElementById("copyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       2. PRODUCT SEARCH ELEMENTS
       ===================================================== */

    const searchForm = document.getElementById("menuSearchForm");
    const searchInput = document.getElementById("menuSearch");
    const searchSuggestions = document.getElementById("searchSuggestions");
    const clearSearchButton = document.getElementById("clearSearch");
    const searchMessage = document.getElementById("searchMessage");
    const noProductsMessage = document.getElementById("noProductsMessage");
    const sortProducts = document.getElementById("sortProducts");

    const productCards = Array.from(
        document.querySelectorAll(".menu-item")
    );

    const categorySections = Array.from(
        document.querySelectorAll(".category-section")
    );


    /* =====================================================
       3. PRODUCT SEARCH
       ===================================================== */

    function searchProducts(searchTerm) {

        const term = searchTerm.trim().toLowerCase();

        let visibleProducts = 0;

        productCards.forEach(function (product) {

            const productName =
                (product.dataset.name || "").toLowerCase();

            const productDescription =
                product.querySelector("p")?.textContent.toLowerCase() || "";

            const matches =
                productName.includes(term) ||
                productDescription.includes(term);

            product.hidden = !matches;

            if (matches) {
                visibleProducts++;
            }

        });

        categorySections.forEach(function (section) {

            const visibleCards = section.querySelectorAll(
                ".menu-item:not([hidden])"
            );

            section.hidden = visibleCards.length === 0;

        });

        if (searchMessage) {

            if (term === "") {

                searchMessage.textContent = "Showing all products.";

            } else {

                searchMessage.textContent =
                    visibleProducts +
                    (visibleProducts === 1
                        ? " product found."
                        : " products found.");

            }

        }

        if (noProductsMessage) {
            noProductsMessage.hidden = visibleProducts !== 0;
        }

        if (searchSuggestions) {
            searchSuggestions.hidden = true;
        }

    }


    /* =====================================================
       4. AUTOCOMPLETE SUGGESTIONS
       ===================================================== */

    function showSuggestions() {

        if (!searchInput || !searchSuggestions) return;

        const term = searchInput.value.trim().toLowerCase();

        searchSuggestions.innerHTML = "";

        if (term.length === 0) {
            searchSuggestions.hidden = true;
            return;
        }

        const matches = productCards.filter(function (product) {

            return (product.dataset.name || "")
                .toLowerCase()
                .includes(term);

        });

        if (matches.length === 0) {
            searchSuggestions.hidden = true;
            return;
        }

        matches.forEach(function (product) {

            const suggestion = document.createElement("button");

            suggestion.type = "button";
            suggestion.className = "search-suggestion";
            suggestion.setAttribute("role", "option");

            const price = Number(product.dataset.price);

            suggestion.textContent =
                (product.dataset.name || "Product") +
                " - R" +
                (Number.isFinite(price) ? price.toFixed(2) : "0.00");

            suggestion.addEventListener("click", function () {

                searchInput.value = product.dataset.name;

                searchProducts(product.dataset.name);

                searchSuggestions.hidden = true;

                product.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            });

            searchSuggestions.appendChild(suggestion);

        });

        searchSuggestions.hidden = false;

    }


    if (searchInput) {
        searchInput.addEventListener("input", showSuggestions);
    }


    if (searchForm && searchInput) {

        searchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            searchProducts(searchInput.value);

        });

    }


    /* =====================================================
       5. CLEAR SEARCH
       ===================================================== */

    if (clearSearchButton) {

        clearSearchButton.addEventListener("click", function () {

            if (searchInput) {
                searchInput.value = "";
            }

            searchProducts("");

            if (searchInput) {
                searchInput.focus();
            }

        });

    }


    /* =====================================================
       6. CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", function (event) {

        if (
            searchSuggestions &&
            searchInput &&
            !searchSuggestions.contains(event.target) &&
            event.target !== searchInput
        ) {

            searchSuggestions.hidden = true;

        }

    });


    /* =====================================================
       7. SORT PRODUCTS
       ===================================================== */

    if (sortProducts) {

        sortProducts.addEventListener("change", function () {

            const selectedSort = sortProducts.value;

            categorySections.forEach(function (section) {

                const productContainer =
                    section.querySelector(".category-products");

                if (!productContainer) return;

                const products = Array.from(
                    productContainer.querySelectorAll(".menu-item")
                );

                products.sort(function (a, b) {

                    const nameA = (a.dataset.name || "").toLowerCase();
                    const nameB = (b.dataset.name || "").toLowerCase();

                    const priceA = Number(a.dataset.price);
                    const priceB = Number(b.dataset.price);

                    switch (selectedSort) {

                        case "name":
                            return nameA.localeCompare(nameB);

                        case "price-low":
                            return priceA - priceB;

                        case "price-high":
                            return priceB - priceA;

                        default:
                            return productCards.indexOf(a) -
                                productCards.indexOf(b);

                    }

                });

                products.forEach(function (product) {
                    productContainer.appendChild(product);
                });

            });

        });

    }


    /* =====================================================
       8. EXPLORE MENU CATEGORY NAVIGATION
       ===================================================== */

    document.querySelectorAll(
        '.menu-sidebar a[href^="#"]'
    ).forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID = link.getAttribute("href");

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            if (searchInput && searchInput.value.trim() !== "") {

                searchInput.value = "";

                searchProducts("");

            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetID);

        });

    });


    /* =====================================================
       9. SHOPPING CART ELEMENTS
       ===================================================== */

    const cartItemsContainer =
        document.getElementById("cartItems");

    const cartItemCount =
        document.getElementById("cartItemCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");

    const cartStatus =
        document.getElementById("cartStatus");


    /* =====================================================
       10. LOAD SAVED CART
       ===================================================== */

    let cart = [];

    try {

        const savedCart = JSON.parse(
            localStorage.getItem("kofiCart")
        );

        if (Array.isArray(savedCart)) {

            cart = savedCart.filter(function (item) {

                return (
                    item &&
                    typeof item.name === "string" &&
                    Number.isFinite(Number(item.price)) &&
                    Number(item.price) > 0 &&
                    Number.isInteger(Number(item.quantity)) &&
                    Number(item.quantity) > 0
                );

            }).map(function (item) {

                return {
                    name: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity)
                };

            });

        }

    } catch (error) {

        console.error("Unable to load shopping cart:", error);

        cart = [];

    }


    /* =====================================================
       11. FORMAT SOUTH AFRICAN RAND
       ===================================================== */

    function formatPrice(price) {

        return "R" + Number(price).toFixed(2);

    }


    /* =====================================================
       12. SAVE CART
       ===================================================== */

    function saveCart() {

        try {

            localStorage.setItem(
                "kofiCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error("Unable to save shopping cart:", error);

        }

    }


    /* =====================================================
       13. DISPLAY SHOPPING CART
       ===================================================== */

    function displayCart() {

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.className = "cart-empty";

            emptyMessage.textContent =
                "Your cart is currently empty. Add a product to get started.";

            cartItemsContainer.appendChild(emptyMessage);

        } else {

            cart.forEach(function (item, index) {

                const subtotal = item.price * item.quantity;

                totalItems += item.quantity;
                totalPrice += subtotal;

                const cartRow = document.createElement("div");

                cartRow.className = "cart-row";

                const productInformation =
                    document.createElement("div");

                const productName =
                    document.createElement("div");

                productName.className = "cart-product-name";
                productName.textContent = item.name;

                const unitPrice = document.createElement("p");

                unitPrice.textContent =
                    "Price per item: " + formatPrice(item.price);

                const subtotalElement =
                    document.createElement("div");

                subtotalElement.className =
                    "cart-product-subtotal";

                subtotalElement.textContent =
                    "Subtotal: " + formatPrice(subtotal);

                productInformation.appendChild(productName);
                productInformation.appendChild(unitPrice);
                productInformation.appendChild(subtotalElement);


                // Quantity controls

                const controls = document.createElement("div");

                controls.className = "cart-controls";


                // Decrease quantity button

                const decreaseButton =
                    document.createElement("button");

                decreaseButton.type = "button";
                decreaseButton.textContent = "−";

                decreaseButton.setAttribute(
                    "aria-label",
                    "Decrease " + item.name + " quantity"
                );

                decreaseButton.addEventListener("click", function () {

                    if (cart[index].quantity > 1) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }

                    saveCart();
                    displayCart();

                });


                // Quantity display

                const quantityDisplay =
                    document.createElement("span");

                quantityDisplay.textContent =
                    "Quantity: " + item.quantity;


                // Increase quantity button

                const increaseButton =
                    document.createElement("button");

                increaseButton.type = "button";
                increaseButton.textContent = "+";

                increaseButton.setAttribute(
                    "aria-label",
                    "Increase " + item.name + " quantity"
                );

                increaseButton.addEventListener("click", function () {

                    cart[index].quantity++;

                    saveCart();
                    displayCart();

                });


                // Remove product button

                const removeButton =
                    document.createElement("button");

                removeButton.type = "button";
                removeButton.className = "remove-cart-item";
                removeButton.textContent = "Remove";

                removeButton.addEventListener("click", function () {

                    cart.splice(index, 1);

                    saveCart();
                    displayCart();

                });


                controls.appendChild(decreaseButton);
                controls.appendChild(quantityDisplay);
                controls.appendChild(increaseButton);
                controls.appendChild(removeButton);

                cartRow.appendChild(productInformation);
                cartRow.appendChild(controls);

                cartItemsContainer.appendChild(cartRow);

            });

        }


        // Update cart item count

        if (cartItemCount) {

            cartItemCount.textContent =
                totalItems +
                (totalItems === 1 ? " item" : " items");

        }


        // Update cart total

        if (cartTotal) {

            cartTotal.textContent = formatPrice(totalPrice);

        }


        // Enable or disable checkout

        if (checkoutButton) {

            checkoutButton.disabled = cart.length === 0;

        }

        saveCart();

    }


    /* =====================================================
       14. ADD PRODUCTS TO CART
       ===================================================== */

    document.querySelectorAll(
        ".menu-item .btn"
    ).forEach(function (button) {

        button.addEventListener("click", function () {

            const product = button.closest(".menu-item");

            if (!product) return;

            const productName = product.dataset.name;

            const productPrice =
                Number(product.dataset.price);

            if (
                !productName ||
                !Number.isFinite(productPrice) ||
                productPrice <= 0
            ) {

                return;

            }


            // Check whether the product is already in the cart

            const existingProduct = cart.find(function (item) {

                return item.name === productName;

            });


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({

                    name: productName,
                    price: productPrice,
                    quantity: 1

                });

            }


            saveCart();
            displayCart();


            // Show temporary confirmation

            const originalText = button.textContent;

            button.textContent = "Added to Cart!";
            button.disabled = true;

            setTimeout(function () {

                button.textContent = originalText;
                button.disabled = false;

            }, 800);


            // Scroll to shopping cart

            if (cartStatus) {

                cartStatus.scrollIntoView({

                    behavior: "smooth",
                    block: "start"

                });

            }

        });

    });


    /* =====================================================
       15. CHECKOUT
       ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (cart.length === 0) return;

            let orderSummary =
                "KOFI COFFEE SHOP\nORDER SUMMARY\n\n";

            let total = 0;

            cart.forEach(function (item) {

                const subtotal = item.price * item.quantity;

                total += subtotal;

                orderSummary +=
                    item.name +
                    "\nQuantity: " + item.quantity +
                    "\nUnit price: " + formatPrice(item.price) +
                    "\nSubtotal: " + formatPrice(subtotal) +
                    "\n\n";

            });

            orderSummary += "TOTAL: " + formatPrice(total);

            orderSummary +=
                "\n\nThis is a demonstration checkout. No payment has been processed.";

            alert(orderSummary);

        });

    }


    /* =====================================================
       16. INITIALISE SHOPPING CART
       ===================================================== */

    displayCart();


    /* =====================================================
       17. PRODUCT IMAGE LIGHTBOX
       ===================================================== */

    const imageLightbox =
        document.getElementById("imageLightbox");

    const lightboxImage =
        imageLightbox?.querySelector("img");

    const closeLightbox =
        document.getElementById("closeLightbox");


    // Open image lightbox

    document.querySelectorAll(".menu-item img").forEach(function (image) {

        image.addEventListener("click", function () {

            if (!imageLightbox || !lightboxImage) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            imageLightbox.style.display = "flex";

            imageLightbox.setAttribute(
                "aria-hidden",
                "false"
            );

        });

    });


    // Close image lightbox

    function closeImageLightbox() {

        if (!imageLightbox) return;

        imageLightbox.style.display = "none";

        imageLightbox.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (closeLightbox) {

        closeLightbox.addEventListener(
            "click",
            closeImageLightbox
        );

    }


    if (imageLightbox) {

        imageLightbox.addEventListener("click", function (event) {

            if (event.target === imageLightbox) {

                closeImageLightbox();

            }

        });

    }


    // Close lightbox using Escape key

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeImageLightbox();

        }

    });


    /* =====================================================
       18. FAQ ACCORDION
       ===================================================== */

    const faqQuestions = document.querySelectorAll(
        ".faq-question"
    );

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const answer = question.nextElementSibling;

            if (!answer) return;

            const isOpen = answer.style.display === "block";


            // Close all FAQ answers

            document.querySelectorAll(".faq-answer").forEach(
                function (item) {

                    item.style.display = "none";

                }
            );


            // Open selected answer

            if (!isOpen) {

                answer.style.display = "block";

            }

        });

    });


    /* =====================================================
       19. FORM FEEDBACK AND VALIDATION FUNCTIONS
       ===================================================== */


    // Find the existing response message in the HTML.

    function createFormMessage(form) {

        let feedback = form.querySelector(
            "#enquiryResponse, #contactResponse, .form-response"
        );


        // Also check for response elements immediately
        // outside the form.

        if (!feedback) {

            const responseID =
                form.id === "enquiryForm"
                    ? "enquiryResponse"
                    : form.id === "contactForm"
                        ? "contactResponse"
                        : null;

            if (responseID) {

                feedback = document.getElementById(responseID);

            }

        }


        // Create a response element if one does not exist.

        if (!feedback) {

            feedback = document.createElement("div");

            feedback.className = "form-response";

            feedback.setAttribute("role", "status");

            feedback.setAttribute("aria-live", "polite");

            form.appendChild(feedback);

        }

        return feedback;

    }


    // Display validation error underneath a field.

    function showFieldError(field) {

        let error = field.nextElementSibling;

        if (
            !error ||
            !error.classList.contains("field-error")
        ) {

            error = document.createElement("small");

            error.className = "field-error";

            field.insertAdjacentElement(
                "afterend",
                error
            );

        }

        error.textContent = field.validationMessage;

        field.setAttribute("aria-invalid", "true");

    }


    // Clear validation error when the field is corrected.

    function clearFieldError(field) {

        const error = field.nextElementSibling;

        if (
            error &&
            error.classList.contains("field-error")
        ) {

            error.remove();

        }

        field.removeAttribute("aria-invalid");

    }


    // Validate all applicable form fields.

    function validateForm(form) {

        let isValid = true;

        const fields = form.querySelectorAll(
            "input, textarea, select"
        );

        fields.forEach(function (field) {

            // Ignore fields that do not participate
            // in browser validation.

            if (!field.willValidate) return;

            clearFieldError(field);

            if (!field.checkValidity()) {

                showFieldError(field);

                isValid = false;

            }

        });

        return isValid;

    }


    /* =====================================================
       20. AJAX FORM SUBMISSION
       ===================================================== */

    async function handleAjaxForm(form) {

        const feedback = createFormMessage(form);

        // Clear previous feedback.

        feedback.textContent = "";

        feedback.className = "form-response";


        // CLIENT-SIDE VALIDATION

        if (!validateForm(form)) {

            feedback.textContent =
                "Please correct the highlighted fields before submitting.";

            feedback.classList.add("error-message");


            // Focus the first invalid field.

            const firstInvalidField = form.querySelector(
                "[aria-invalid='true']"
            );

            if (firstInvalidField) {

                firstInvalidField.focus();

            }

            return;

        }


        // Get the Formspree endpoint.

        const endpoint = form.getAttribute("action");

        if (
            !endpoint ||
            !endpoint.startsWith("https://formspree.io/f/")
        ) {

            feedback.textContent =
                "Form submission is not configured. Please try again later.";

            feedback.classList.add("error-message");

            return;

        }


        // Find the submit button.

        const submitButton = form.querySelector(
            "button[type='submit'], input[type='submit']"
        );


        // Save the original button text.

        const originalButtonText = submitButton
            ? (
                submitButton.tagName === "INPUT"
                    ? submitButton.value
                    : submitButton.textContent
            )
            : "";


        // Prevent repeated submissions.

        if (submitButton) {

            submitButton.disabled = true;

            if (submitButton.tagName === "INPUT") {

                submitButton.value = "Submitting...";

            } else {

                submitButton.textContent = "Submitting...";

            }

        }


        // Display submission status.

        feedback.textContent = "Submitting your form...";

        feedback.classList.add("info-message");


        try {

            // Submit form data asynchronously using AJAX.

            const response = await fetch(endpoint, {

                method: "POST",

                body: new FormData(form),

                headers: {

                    "Accept": "application/json"

                }

            });


            // Read the response returned by Formspree.

            const result = await response.json().catch(function () {

                return null;

            });


            // Check whether the submission was successful.

            if (!response.ok) {

                let errorMessage =
                    "The server could not process your submission.";

                if (
                    result &&
                    Array.isArray(result.errors) &&
                    result.errors.length > 0
                ) {

                    errorMessage = result.errors
                        .map(function (error) {

                            return error.message;

                        })
                        .join(" ");

                }

                throw new Error(
                    errorMessage +
                    " Status: " +
                    response.status
                );

            }


            // SUCCESSFUL SUBMISSION

            form.reset();


            // Clear all previous validation errors.

            form.querySelectorAll(
                "input, textarea, select"
            ).forEach(function (field) {

                clearFieldError(field);

            });


            // Display success message.

            feedback.textContent =
                "Thank you! Your message has been submitted successfully. We appreciate you contacting Kofi Coffee Shop.";

            feedback.className =
                "form-response success-message";


        } catch (error) {

            // Record the error in the browser console.

            console.error(
                "AJAX form submission error:",
                error
            );


            // Display an error message to the customer.

            feedback.textContent =
                "Sorry, your message could not be submitted. " +
                error.message +
                " Please check your internet connection and try again.";

            feedback.className =
                "form-response error-message";


        } finally {

            // Re-enable the submit button.

            if (submitButton) {

                submitButton.disabled = false;

                if (submitButton.tagName === "INPUT") {

                    submitButton.value = originalButtonText;

                } else {

                    submitButton.textContent = originalButtonText;

                }

            }

        }

    }


    /* =====================================================
       21. ENQUIRY FORM AJAX SUBMISSION
       ===================================================== */

    const enquiryForm =
        document.getElementById("enquiryForm");

    if (enquiryForm) {

        // Set the Formspree endpoint only if the HTML
        // does not already contain one.

        if (!enquiryForm.getAttribute("action")) {

            enquiryForm.setAttribute(
                "action",
                "https://formspree.io/f/xgaadgqe"
            );

        }

        enquiryForm.setAttribute("method", "POST");


        // Handle enquiry form submission.

        enquiryForm.addEventListener("submit", function (event) {

            // Prevent normal page refresh.

            event.preventDefault();

            // Submit the form using AJAX.

            handleAjaxForm(enquiryForm);

        });

    }


    /* =====================================================
       22. CONTACT FORM AJAX SUBMISSION
       ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {

        // Set the Formspree endpoint only if the HTML
        // does not already contain one.

        if (!contactForm.getAttribute("action")) {

            contactForm.setAttribute(
                "action",
                "https://formspree.io/f/xgaadgqe"
            );

        }

        contactForm.setAttribute("method", "POST");


        // Handle contact form submission.

        contactForm.addEventListener("submit", function (event) {

            // Prevent normal page refresh.

            event.preventDefault();

            // Submit the form using AJAX.

            handleAjaxForm(contactForm);

        });

    }


    /* =====================================================
       23. CLEAR ERRORS WHEN USERS CORRECT INPUT
       ===================================================== */

    document.querySelectorAll(
        "#enquiryForm input, #enquiryForm textarea, #enquiryForm select, " +
        "#contactForm input, #contactForm textarea, #contactForm select"
    ).forEach(function (field) {


        // Listen for typing and input changes.

        field.addEventListener("input", function () {

            if (field.checkValidity()) {

                clearFieldError(field);

            }

        });


        // Listen for changed selections.

        field.addEventListener("change", function () {

            if (field.checkValidity()) {

                clearFieldError(field);

            }

        });

    });


    /* =====================================================
       24. LEAFLET MAP
       ===================================================== */

    const mapElement = document.getElementById("map");

    if (mapElement && typeof L !== "undefined") {

        const shopLatitude = -25.7479;

        const shopLongitude = 28.2293;


        // Create the map.

        const map = L.map("map").setView(

            [shopLatitude, shopLongitude],

            15

        );


        // Add OpenStreetMap tiles.

        L.tileLayer(

            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

            {

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

            }

        ).addTo(map);


        // Add Kofi Coffee Shop marker.

        L.marker([

            shopLatitude,

            shopLongitude

        ]).addTo(map)

            .bindPopup("<strong>Kofi Coffee Shop</strong>")

            .openPopup();

    }

});
