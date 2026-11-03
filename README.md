

<!-- Customer favourites slideshow -->
<section class="featured-section favourites-section">

    <div class="favourites-heading">
        <p class="section-label">MADE WITH LOVE AT KOFI</p>
        <h2>Our Customers' Favourites</h2>
        <p>
            Discover the drinks and treats our customers love.
            Your next favourite might be waiting here!
        </p>
    </div>

    <div class="favourites-slider" id="favouritesSlider">

        <div class="favourites-track" id="favouritesTrack">

            <article class="favourite-card">
                <div class="favourite-image">
                    <img src="images/espresso.jpg"
                         alt="Rich freshly brewed espresso">
                    <span class="favourite-tag">Customer Favourite</span>
                </div>
                <div class="favourite-info">
                    <h3>Espresso</h3>
                    <p>
                        Rich, bold and full of flavour.
                        Perfect for coffee lovers.
                    </p>
                    <a href="products.html" class="favourite-link">
                        Explore Product →
                    </a>
                </div>
            </article>

            <article class="favourite-card">
                <div class="favourite-image">
                    <img src="images/cappuccino.jpg"
                         alt="Creamy cappuccino with milk foam">
                    <span class="favourite-tag">Popular Choice</span>
                </div>
                <div class="favourite-info">
                    <h3>Cappuccino</h3>
                    <p>
                        Smooth espresso with steamed milk
                        and a delicious layer of foam.
                    </p>
                    <a href="products.html" class="favourite-link">
                        Explore Product →
                    </a>
                </div>
            </article>

            <article class="favourite-card">
                <div class="favourite-image">
                    <img src="images/croissant.jpg"
                         alt="Fresh golden croissant">
                    <span class="favourite-tag">Freshly Baked</span>
                </div>
                <div class="favourite-info">
                    <h3>Fresh Croissant</h3>
                    <p>
                        A golden, buttery pastry that pairs
                        beautifully with your coffee.
                    </p>
                    <a href="products.html" class="favourite-link">
                        Explore Product →
                    </a>
                </div>
            </article>

        </div>

        <div class="slider-controls">

            <button type="button"
                    id="previousFavourite"
                    aria-label="Previous favourite">
                &#8592;
            </button>

            <div class="slider-dots" id="favouriteDots">
                <button type="button" aria-label="Show favourite 1"
                        class="active"></button>
                <button type="button" aria-label="Show favourite 2"></button>
                <button type="button" aria-label="Show favourite 3"></button>
            </div>

            <button type="button"
                    id="nextFavourite"
                    aria-label="Next favourite">
                &#8594;
            </button>

        </div>

    </div>

    <a href="products.html" class="btn favourites-menu-button">
        View Our Full Menu
    </a>

</section>
