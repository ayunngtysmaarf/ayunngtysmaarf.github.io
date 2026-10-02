// Renders index.html with the print stylesheet and exports it to a PDF.
// Local-only dependency: puppeteer (devDependency, not installed globally).
const path = require("path");
const puppeteer = require("puppeteer");

async function main() {
  const outPath = path.join(__dirname, "..", "assets", "ayuningtyas-maarif-portfolio.pdf");
  const url = "file://" + path.join(__dirname, "..", "index.html");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulateMediaType("print");
  await page.goto(url, { waitUntil: "networkidle0" });

  // Scroll-reveal animations and the collapsed "earlier work" <details>
  // never trigger without real scrolling — force them open for the PDF.
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll("details").forEach((el) => el.open = true);
  });

  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  console.log("PDF written to", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
