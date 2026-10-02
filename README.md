# Dr. Health Website

This is the refactored version of the Dr. Health 3 in 1 Steam Inhaler website.

## Folder structure

- `index.html` — page structure/content
- `css/style.css` — visual design and responsive styles
- `js/config.js` — **EDIT THIS FIRST** for common business/product changes
- `js/script.js` — website interactions and configuration logic
- `images/` — reserved for future external image files

## Easy updates

For phone number, WhatsApp number, email, address, licence, manufacturer, product name, price, warranty, shipping banner, page title or SEO description, edit only:

`js/config.js`

After saving, refresh the website locally and then deploy the updated folder to Netlify.

## Example: change the price

Open `js/config.js` and change:

```js
price: 999,
```

to:

```js
price: 1099,
```

The visible price, quantity options and WhatsApp enquiry text will follow the configured product price.

## Example: change WhatsApp number

Change:

```js
whatsapp: '919421208624',
```

Keep the WhatsApp number in international format with country code and no `+`, spaces or brackets.

## Local testing

From this folder run:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`

## Deployment

This folder can be uploaded to Netlify as a static site. Later, it can also be connected to a GitHub repository for automatic deployments.
