const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  );
  await page.goto(
    "https://www.olx.pl/oferta/wynajme-mieszkanie-2-pokojowe-od-1-12-2019-CID3-IDCq9W5.html"
  );

  //   await page.screenshot({ path: "example.png" });

  let title = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".offer-titlebox h1")).map(
      el => el.innerText
    )
  );
  let price = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".price-label strong")).map(
      el => el.innerText
    )
  );
  console.log(title, price);

  await browser.close();
})();
