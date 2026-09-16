# Ayuningtyas Maarif Portfolio

A bilingual, responsive personal portfolio for Ayuningtyas Maarif, built as a lightweight static website and deployed through GitHub Pages.

The portfolio presents experience in retail operations, customer experience, team coordination, administration, research, and community work. Its visual direction uses an editorial layout, restrained colors, serif-led typography, structured spacing, and subtle motion rather than a conventional card-based template.

## Live Website

[ayunngtysmaarf.github.io](https://ayunngtysmaarf.github.io)

## Technology

The website intentionally uses no framework, build system, or package dependencies.

- Semantic HTML5
- Native CSS
- Vanilla JavaScript
- GitHub Pages
- WebP portrait image
- PDF resume download

This approach keeps the website fast, easy to maintain, and deployable directly from the repository root.

## Project Structure

```text
.
├── assets/
│   ├── ayuningtyas-maarif-cv.pdf
│   ├── favicon.svg
│   └── portfolio.webp
├── index.html
├── script.js
├── styles.css
└── README.md
```

### `index.html`

Contains the complete semantic page structure and portfolio content:

- Fixed navigation
- Hero and portrait
- Professional profile
- Career highlights
- Current and previous experience
- Areas of expertise
- Research and publications
- Education and certifications
- Nasi Kita Jogja community work
- Contact information

Indonesian and English translations are stored directly on elements using `data-id` and `data-en` attributes. This keeps both languages available without additional requests or duplicated pages.

Example:

```html
<p
  data-id="Bekerja dengan detail, berpikir menyeluruh."
  data-en="Working in detail, thinking in systems."
>
  Bekerja dengan detail, berpikir menyeluruh.
</p>
```

### `styles.css`

Defines the complete visual system and responsive behavior:

- Color and typography variables
- Editorial grid system
- Sticky navigation and section labels
- Desktop, tablet, phone, and landscape breakpoints
- Mobile hamburger navigation
- Profile metric layouts
- Experience timeline
- Sticky expertise heading
- Research and publication layouts
- Scroll-reveal and hover effects
- Reduced-motion support
- Print styles

The main design tokens are at the top of the file:

```css
:root {
  --paper: #f1ede5;
  --paper-dark: #e7dfd2;
  --ink: #20201d;
  --muted: #69665f;
  --accent: #a8432e;
}
```

Changing these values updates the primary color palette throughout the website.

### `script.js`

Provides progressive enhancement without external libraries:

- Indonesian and English language switching
- Saved language preference through `localStorage`
- Accessible mobile menu behavior
- Animated sales counters
- Scroll-triggered content reveals
- Reading-progress indicator
- Rotating expertise label in the hero
- Dynamic copyright year

The content remains readable if JavaScript is unavailable. JavaScript is used for interaction and motion rather than for rendering the page itself.

## Content Approach

The website was developed from several role-specific CV versions. Instead of publishing every resume bullet, the content was consolidated into one professional narrative.

Ongoing responsibilities are labeled according to their actual commitment type:

- Primary role
- Part-time
- Project-based
- Independent project
- Community work

This prevents multiple active activities from appearing as simultaneous full-time positions.

The portfolio highlights measurable outcomes such as monthly device sales, ticketing volume, academic performance, and English proficiency. Research cards link to verified public publication pages where available.

## Bilingual System

Indonesian is the default language. Visitors can switch to English using the `ID / EN` control.

The selected language is saved in the browser:

```js
localStorage.setItem("portfolio-language", language);
```

To translate new content:

1. Add `data-id` and `data-en` to the element.
2. Keep the initial text equal to the Indonesian value.
3. The existing language switch will include it automatically.

For text used in attributes, such as menu accessibility labels, update the relevant language handling in `script.js`.

## Responsive Design

The site is designed for several layout ranges rather than only desktop and mobile.

- Large desktop: full editorial grids and wide spacing
- Small desktop: constrained section columns
- Tablet: reduced grids and reorganized metrics
- Phone: hamburger navigation, single-column content, full-width portrait, and compact sticky labels
- Narrow phone: smaller typography and stacked hero actions
- Short landscape display: reduced hero height and portrait size

Touch devices disable hover-only transforms so interactions do not feel stuck or unpredictable.

## Accessibility

Accessibility considerations include:

- Semantic headings and sections
- Skip-to-content link
- Keyboard-accessible language and menu controls
- `aria-expanded` and `aria-controls` on the hamburger menu
- Escape key support for closing the mobile menu
- Visible focus styles
- Descriptive portrait alternative text
- Reduced-motion support through `prefers-reduced-motion`
- Sufficient text contrast
- Print-friendly presentation

## Motion

Motion is intentionally restrained and supports the content hierarchy:

- Staged hero entrance
- Scroll-triggered section reveals
- Animated section rules
- Count-up sales metrics
- Reading progress at the top of the viewport
- Subtle hover movement on desktop
- Rotating expertise text

Users who request reduced motion receive the content without entrance animations or animated scrolling.

## Running Locally

No installation is required. Open `index.html` directly, or use any static file server.

For example, with Python:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

Using a local server is recommended when checking browser behavior, links, and mobile emulation.

## Updating Content

### Replace the portrait

Replace `assets/portfolio.webp` with another WebP image using the same filename. A square or portrait-oriented source works best.

If the crop needs adjustment, edit:

```css
.portrait-placeholder img {
  object-position: center top;
}
```

### Replace the CV

Replace `assets/ayuningtyas-maarif-cv.pdf` while keeping the filename unchanged. Both download links will continue to work.

### Add an experience

Add another `.experience-item` article in the experience section. Use the existing structure for the date, employment type, role, organization, and bilingual description.

### Add a publication

Add an article inside `.work-list`, or use the featured research card for the primary publication. External links should use:

```html
target="_blank" rel="noreferrer"
```

### Update contact details

Contact links are located near the bottom of `index.html`. Update the visible text and the matching `mailto:`, `tel:`, or external URL.

## Validation

The project can be checked with the following commands:

```bash
npx --yes html-validate@8.24.0 index.html
node --check script.js
git diff --check
```

The pinned HTML validator version supports the Node.js version used during development.

Responsive behavior should also be reviewed in browser developer tools at common widths such as:

- 320 px
- 375 px
- 430 px
- 768 px
- 1024 px
- 1440 px

## Deployment

The repository is configured for a GitHub Pages user site. GitHub serves the files from the `main` branch at:

[https://ayunngtysmaarf.github.io](https://ayunngtysmaarf.github.io)

To deploy an update:

```bash
git add index.html styles.css script.js assets README.md
git commit -m "Describe the portfolio update"
git push origin main
```

GitHub Pages may take a few minutes to publish a new commit.

## Design Principles

- Keep the content factual and concise.
- Prefer verified metrics and publication links.
- Preserve clear employment-type labels for concurrent roles.
- Avoid adding dependencies for effects that native browser features can handle.
- Treat mobile as a deliberate composition, not a compressed desktop layout.
- Use animation to clarify hierarchy rather than distract from the content.

## License

The website code may be adapted for personal use. The portrait, resume, written biography, professional history, and other personal content belong to Ayuningtyas Maarif and should not be reused without permission.
