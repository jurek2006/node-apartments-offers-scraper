const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  );
  await page.goto("https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/");

  //   await page.screenshot({ path: "example.png" });

  //   get without promoted offers:
  // Array.from(document.querySelectorAll("table.offers:not(.offers--top)"));

  // get offers' list:
  let offers = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "table.offers:not(.offers--top) a.detailsLink:not(.thumb)"
      )
    ).map(offer => ({ title: offer.innerText, href: offer.href }))
  );
  console.log(offers);

  await browser.close();
})();
