require('dotenv').config();
const puppeteer = require('puppeteer-core');

exports.launchBrowser = async() => {
    try{
        const browser = await puppeteer.launch({
            "headless":true,
            // userDataDir:process.env.CHROME_USER_DATA_PATH,
            defaultViewport: false,
            executablePath:process.env.CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });


        // const page = await browser.newPage();
        // await page.goto(url, {
        //     waitUntil:'domcontentloaded'
        // });
        
        return browser;
    }catch (error) {
        console.log(error);
        throw error;
    }
}