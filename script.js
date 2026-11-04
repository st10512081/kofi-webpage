
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // PRODUCT PAGE ELEMENTS
    // =========================================

    const menuItemsContainer = document.getElementById("menuItems");

    // The script is also loaded on other pages.
    // Stop the menu code if this is not the products page.
    if (!menuItemsContainer) {
        const yearElement = document.getElementById("copyrightYear");

        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        return;
    }

    const searchForm = document.getElementById("menuSearchForm");
    const searchInput = document.getElementById("menuSearch");
    const clearSearchButton = document.getElementById("clearSearch");
    const searchMessage = document.getElementById("searchMessage");
    const noProductsMessage = document.getElementById("noProductsMessage");
    const sortSelect = document.getElementById("sortProducts");

    const cartItemsContainer = document.getElementById("cartItems");
    const cartItemCount = document.getElementById("cartItemCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    const productCards = Array.from(
        document.querySelectorAll(".menu-item")
    );

    let cart = [];

    // =========================================
    // CART STORAGE
    // =========================================

    function loadCart() {

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
                        Number(item.price) >= 0 &&
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

            cart = [];

        }

    }

    function saveCart() {

        try {
            localStorage.setItem("kofiCart", JSON.stringify(cart));
        } catch (error) {
            console.error("Could not save shopping cart:", error);
        }

    }

    // =========================================
    // SEARCH PRODUCTS
    // =========================================

    function searchProducts() {

        const searchTerm = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;

        productCards.forEach(function (card) {

            const productName =
                (card.dataset.name || "").toLowerCase();

            const descriptionElement =
                card.querySelector(".product-details p:not(.product-price)");

            const description = descriptionElement
                ? descriptionElement.textContent.toLowerCase()
                : "";

            const matches =
                productName.includes(searchTerm) ||
                description.includes(searchTerm);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }

        });

        // Hide category headings when no products in that category match.
        document.querySelectorAll(".category-section").forEach(function (section) {

            const visibleProducts = Array.from(
                section.querySelectorAll(".menu-item")
            ).some(function (card) {
                return !card.hidden;
            });

            section.hidden = !visibleProducts;

        });

        noProductsMessage.hidden = visibleCount !== 0;

        if (searchTerm === "") {

            searchMessage.textContent =
                "Showing all " + productCards.length + " products.";

        } else {

            searchMessage.textContent =
                visibleCount + " product" +
                (visibleCount === 1 ? "" : "s") +
                " found.";

        }

    }

    searchInput.addEventListener("input", searchProducts);

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();
        searchProducts();

    });

    clearSearchButton.addEventListener("click", function () {

        searchInput.value = "";
        searchProducts();
        searchInput.focus();

    });

    // =========================================
    // SORT PRODUCTS
    // =========================================

    function sortProducts() {

        const sortValue = sortSelect.value;

        document.querySelectorAll(".category-products").forEach(function (container) {

            const cards = Array.from(
                container.querySelectorAll(".menu-item")
            );

            cards.sort(function (a, b) {

                const nameA = a.dataset.name || "";
                const nameB = b.dataset.name || "";

                const priceA = Number(a.dataset.price);
                const priceB = Number(b.dataset.price);

                if (sortValue === "name") {
                    return nameA.localeCompare(nameB);
                }

                if (sortValue === "price-low") {
                    return priceA - priceB;
                }

                if (sortValue === "price-high") {
                    return priceB - priceA;
                }

                return productCards.indexOf(a) - productCards.indexOf(b);

            });

            cards.forEach(function (card) {
                container.appendChild(card);
            });

        });

        searchProducts();

    }

    sortSelect.addEventListener("change", sortProducts);

    // =========================================
    // SHOPPING CART
    // =========================================

    function formatMoney(amount) {
        return "R" + amount.toFixed(2);
    }

    function renderCart() {

        cartItemsContainer.innerHTML = "";

        let totalQuantity = 0;
        let totalPrice = 0;

        if (cart.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.className = "cart-empty";
            emptyMessage.textContent =
                "Your cart is currently empty. Add a product to get started.";

            cartItemsContainer.appendChild(emptyMessage);

        } else {

            cart.forEach(function (item) {

                totalQuantity += item.quantity;

                const subtotal = item.price * item.quantity;

                totalPrice += subtotal;

                const row = document.createElement("div");
                row.className = "cart-row";

                const details = document.createElement("div");

                const name = document.createElement("div");
                name.className = "cart-product-name";
                name.textContent = item.name;

                const controls = document.createElement("div");
                controls.className = "cart-controls";

                const minusButton = document.createElement("button");
                minusButton.type = "button";
                minusButton.textContent = "−";
                minusButton.dataset.action = "decrease";
                minusButton.dataset.name = item.name;
                minusButton.setAttribute(
                    "aria-label",
                    "Decrease " + item.name + " quantity"
                );

                const quantity = document.createElement("span");
                quantity.textContent = item.quantity;

                const plusButton = document.createElement("button");
                plusButton.type = "button";
                plusButton.textContent = "+";
                plusButton.dataset.action = "increase";
                plusButton.dataset.name = item.name;
                plusButton.setAttribute(
                    "aria-label",
                    "Increase " + item.name + " quantity"
                );

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.textContent = "Remove";
                removeButton.className = "remove-cart-item";
                removeButton.dataset.action = "remove";
                removeButton.dataset.name = item.name;

                controls.append(
                    minusButton,
                    quantity,
                    plusButton,
                    removeButton
                );

                details.append(name, controls);

                const subtotalText = document.createElement("div");
                subtotalText.className = "cart-product-subtotal";
                subtotalText.textContent = formatMoney(subtotal);

                row.append(details, subtotalText);

                cartItemsContainer.appendChild(row);

            });

        }

        cartItemCount.textContent =
            totalQuantity + " item" + (totalQuantity === 1 ? "" : "s");

        cartTotal.textContent = formatMoney(totalPrice);

        checkoutButton.disabled = cart.length === 0;

        saveCart();

    }

    // =========================================
    // ADD PRODUCTS TO CART
    // =========================================

    menuItemsContainer.addEventListener("click", function (event) {

        const button = event.target.closest(".menu-item .btn");

        if (!button) {
            return;
        }

        const card = button.closest(".menu-item");

        const productName = card.dataset.name;
        const productPrice = Number(card.dataset.price);

        if (!productName || !Number.isFinite(productPrice)) {
            return;
        }

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

        renderCart();

        const originalText = button.textContent;

        button.textContent = "Added!";
        button.disabled = true;

        setTimeout(function () {

            button.textContent = originalText;
            button.disabled = false;

        }, 700);

    });

    // =========================================
    // INCREASE, DECREASE AND REMOVE CART ITEMS
    // =========================================

    cartItemsContainer.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const productName = button.dataset.name;

        const item = cart.find(function (product) {
            return product.name === productName;
        });

        if (!item) {
            return;
        }

        const action = button.dataset.action;

        if (action === "increase") {
            item.quantity++;
        }

        if (action === "decrease") {
            item.quantity--;
        }

        if (action === "remove" || item.quantity <= 0) {

            cart = cart.filter(function (product) {
                return product.name !== productName;
            });

        }

        renderCart();

    });

    // =========================================
    // CHECKOUT
    // =========================================

    checkoutButton.addEventListener("click", function () {

        if (cart.length === 0) {
            return;
        }

        const customerName = prompt(
            "Please enter your name to continue:"
        );

        if (customerName === null) {
            return;
        }

        if (customerName.trim() === "") {

            alert("Please enter your name before checking out.");
            return;

        }

        const orderSummary = cart.map(function (item) {

            const subtotal = item.price * item.quantity;

            return (
                item.name +
                " x " +
                item.quantity +
                " = " +
                formatMoney(subtotal)
            );

        }).join("\n");

        const total = cart.reduce(function (sum, item) {

            return sum + item.price * item.quantity;

        }, 0);

        const confirmation = confirm(
            "Thank you, " + customerName.trim() + "!\n\n" +
            "Your order:\n" +
            orderSummary + "\n\n" +
            "Total: " + formatMoney(total) + "\n\n" +
            "This is a demonstration checkout. No payment will be processed.\n\n" +
            "Would you like to complete this demo checkout?"
        );

        if (!confirmation) {
            return;
        }

        alert(
            "Thank you for choosing Kofi Coffee Shop, " +
            customerName.trim() +
            "!\n\nYour demonstration checkout is complete."
        );

        cart = [];

        renderCart();

    });

    // =========================================
    // PRODUCT IMAGE LIGHTBOX
    // =========================================

    const lightbox = document.getElementById("imageLightbox");

    if (lightbox) {

        const lightboxImage = lightbox.querySelector("img");
        const closeButton = document.getElementById("closeLightbox");

        document.querySelectorAll(".menu-item img").forEach(function (img) {

            img.addEventListener("click", function () {

                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;

                lightbox.style.display = "flex";
                lightbox.setAttribute("aria-hidden", "false");

            });

        });

        function closeLightbox() {

            lightbox.style.display = "none";
            lightbox.setAttribute("aria-hidden", "true");

            lightboxImage.src = "";

        }

        closeButton.addEventListener("click", closeLightbox);

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

    // =========================================
    // AUTOMATIC COPYRIGHT YEAR
    // =========================================

    const copyrightYear = document.getElementById("copyrightYear");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // =========================================
    // INITIALISE THE PAGE
    // =========================================

    loadCart();
    renderCart();
    searchProducts();

});
