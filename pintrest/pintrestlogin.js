require("dotenv").config();
const { getIndianTime } = require("../lib/date_time");
const {delay} = require("../lib/delay");

const pintrest_login = async (browser) => {
  try {
    const page = await browser.newPage();
    await page.goto(process.env.PIN_LOGIN_URL, {
        waitUntil:'domcontentloaded'
    });

    await delay(2000);

    await page.type("input[name = id]", process.env.PINTREST_EMAIL);
    await page.type("input[name = password]", process.env.PINTREST_PASSWORD);


    await delay(2000);
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type = "submit"]'),
    ]);

    await delay(1000);

    console.log(`S: [${getIndianTime()}] `,"Pintrest loged in !!");

    page.close();
    
  } catch (error) {
    throw error;
  }
};


module.exports = {pintrest_login};
