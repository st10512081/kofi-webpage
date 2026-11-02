# Kofi Coffee Shop Website

A responsive multi-page website for the Kofi coffee shop concept.

## Pages
- `index.html` – home page and business introduction.
- `about.html` – organisation background, mission, vision and team.
- `products.html` – drinks and snacks menu with product search, sorting, cart counter and image lightbox.
- `enquiry.html` – enquiry form with client-side validation and a contextual acknowledgement.
- `contact.html` – contact details, locations and a validated general-message form.

## Part 3 functionality
The site uses vanilla JavaScript in `script.js`. Product search filters menu cards as the visitor types. The sort control orders products by name or price. Add to Cart buttons update a session-only cart count and total (no checkout or payment gateway is connected). Product images open in a lightbox that can be closed with its button, by clicking the backdrop, or by pressing Escape.

The enquiry form uses browser validation plus JavaScript validation and displays a response that explains the next step for menu, catering or special-order enquiries. The contact form validates the details and prepares a message addressed to `hello@kofi.co.za` in the visitor's default email application. The visitor must review and press Send.

## SEO
Each page has a unique title, meta description and keyword metadata. Semantic page headings, descriptive image alternative text, responsive viewport settings, internal navigation links, `robots.txt` and `sitemap.xml` have been included. Image lazy-loading is enabled where appropriate.

### Target keywords
- coffee shop Polokwane
- fresh coffee and snacks
- coffee menu
- cappuccino, espresso and matcha
- Kofi contact and catering enquiry

### Off-page SEO actions still required
Share the live website on the organisation's social media profiles and request relevant local directories, partners or community organisations to link to it. Backlinks and social promotion cannot be created by website code alone. Submit the deployed sitemap URL to Google Search Console and Bing Webmaster Tools after deployment.

## Forms and technical limitations
This is a static website. The enquiry form currently validates in the browser and displays an on-page acknowledgement; it does not store or email submissions. The contact form uses a `mailto:` link to prepare an email, so it depends on the visitor having an email application configured. True AJAX form processing requires a server endpoint or a form service (for example, a configured Netlify Forms workflow); do not describe the current static forms as sending data to a database or server.

The Contact page includes interactive Google Maps embeds and external Google Maps links for the two stated branch areas. The maps use area-level search locations rather than verified street addresses; update them if the business confirms exact addresses.

## Run locally
Open `index.html` in a browser, or use a local development server. Keep `script.js`, `style.css`, the HTML pages and the `images/` directory in the same project structure.

## Deploy
The repository can be deployed on GitHub Pages or Netlify. For GitHub Pages, open repository **Settings → Pages**, select the deployment branch and root folder, and save. For Netlify, import the GitHub repository and use the repository root as the publish directory. After deployment, replace the placeholder base URL in `sitemap.xml` with the actual public website URL and submit the sitemap to search engines.

## Changelog

### Part 3 – 2 November 2026
- Added `script.js` and linked it to all five HTML pages using `defer`, ensuring the document is parsed before JavaScript runs.
- Implemented live product filtering, a clear-search control, result counts and sorting by product name or price on `products.html`.
- Implemented Add to Cart interactions with a running item count and total. This is a front-end demonstration only; it does not process payments or persist orders.
- Added a product-image lightbox with close button, backdrop click and Escape-key support.
- Added client-side validation and contextual response messages to the enquiry form. Added minimum/maximum lengths, email validation, South African phone number pattern and a date minimum.
- Improved the contact form with a message-category selector, input length rules and JavaScript validation. The form prepares a `mailto:` email addressed to `hello@kofi.co.za`.
- Added unique SEO title tags, meta descriptions, keyword metadata and robots directives to each page.
- Added `robots.txt` and `sitemap.xml`, with a deployment reminder to replace the sitemap placeholder domain.
- Added image lazy loading, missing alternative text where required, lightbox styling and reduced-motion support. Added interactive Google Maps embeds for the Pretoria Central and Hatfield branch areas.
- Corrected malformed duplicate navigation markup and broken location-section markup on the relevant pages; corrected the About page menu link to point to `products.html`.
- Added this Part 3 documentation, including the distinction between front-end validation and server-side/AJAX processing.

### Part 2 feedback corrections
No lecturer feedback document or specific Part 2 corrections were included in the supplied project archive. Record each actual feedback correction here after receiving the marked rubric/feedback; do not claim unverified feedback changes have been completed.

## References
- MDN Web Docs, HTML forms: https://developer.mozilla.org/en-US/docs/Learn/Forms
- MDN Web Docs, Constraint validation: https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation
- MDN Web Docs, DOM events: https://developer.mozilla.org/en-US/docs/Web/API/Event
- Google Search Central, SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central, Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, robots.txt introduction: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Leaflet documentation (reference for possible future interactive maps): https://leafletjs.com/
