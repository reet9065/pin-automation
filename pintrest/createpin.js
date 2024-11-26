require('dotenv').config();
const {delay} = require("../lib/delay");
const { keyboardType, keyPresser } = require('../lib/keyboard');
const path = require("path");
const {get_data_from_wpapi} = require("../wp/wpAPI");
const { launchBrowser } = require('../lib/browser');
const { pintrest_login } = require('./pintrestlogin');
const fs = require("fs/promises")
// const {launchBrowser} = require("../lib/browser");

const selector = {
    file:"input[type = file]",
    title:"input[id = storyboard-selector-title]",
    description:'xpath///*[@data-test-id="comment-editor-container"]/div/div[2]/div/div/div/div',
    link:"input[id = WebsiteField]",
    board:'xpath///*[@data-test-id="board-dropdown-select-button"]',
    tags:'xpath///*[@id="storyboard-selector-interest-tags"]',
    submit_btn:'xpath///*[@data-test-id="storyboard-creation-nav-done"]/button/div/div',
    pin_creation_done:'xpath///*[@data-test-id="toast"]/a/div/div/div/div[3]/button/div/div'
}

const tags = " Season  download,  Season  hindi download, download  Season  720p,  Season  480p download, download   Season  1080p hd,  Season  hindi dubbed download,  Season  full movie download, download  Season  hindi,  Season  download moviesflix,  Season  download moviesverse,  Season  download in hindi,  Season  download movie,  Season  movie english download,  Season  movie download link,  Season  300mb dual audio,  Season  480p hindi dubbed download,  Season  dual audio download,  Season  google drive link,  Season  english with subtitles download, download  Season  english subtitles,   Season  movie download katmoviehd,  Season  movie download themoviesflix,  Season  download filmywap,  Season  download worldfree4u, download  Season  movie khatrimaza, download  Season  torrent, 480p movies download, 720p hd movies, 300 mb movies, 1080p bluray movies, hindi dubbed movies, 1080p movies, 720p movies, 2019 Movies, 300mb Movies, 480p Movies, Dual Audio Movies,  hollywood movies download, download  Season";

const paste_in_input = async(page,string_text,selector) => {

    try {
        await page.evaluate((text) => {
            navigator.clipboard.writeText(text);  
        }, string_text);

        await delay(500);

        await page.waitForSelector(selector);
        await page.click(selector);

        await page.keyboard.down('Control'); 
        await page.keyboard.press('V');      
        await page.keyboard.up('Control'); 

    } catch (error) {
        
        throw error;
    }
}

const createpin = async(browser, pin_object) => {
    try {

        // browser = await launchBrowser();
        // await pintrest_login(browser);
        // pin_object = await get_data_from_wpapi("https://privatemoviez.icu/spy-kids-collection-2001-2011-720p/");

        const page = await browser.newPage();
        await page.goto(process.env.CREATE_PIN_URL, {
            waitUntil:'domcontentloaded'
        });

        await page.waitForSelector(selector.file);

        const file_path = pin_object.image_path;
        //uploading image

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(), 
            page.click(selector.file) 
        ]);
        
          // Accept the file chooser with the file path
        await fileChooser.accept([file_path]);

        await delay(2000);

        const scroll = await page.waitForSelector(selector.link);
        await page.evaluate((pageitem) => pageitem.scrollIntoView(), scroll)

        await delay(1000);

        // filling the pin details

        await paste_in_input(page,pin_object.title,selector.title);
        
        await paste_in_input(page,pin_object.content,selector.description);

        await paste_in_input(page,"https://www.google.com/search?q=PrivateMovieZ",selector.link)


        const makeTags = tags.split(",").map((item) => `Greedy People (2024) Hin-Eng WEBRip 720p | 1080p${item}`).join(" ");

        await paste_in_input(page,makeTags,selector.tags);

        await page.waitForSelector(selector.board);
        await page.click(selector.board);

        await page.waitForSelector(process.env.BOARD_XPATH);
        await page.click(process.env.BOARD_XPATH);
        await delay(2000);

        await page.waitForSelector(selector.submit_btn);
        await page.click(selector.submit_btn);


        await page.waitForSelector(selector.pin_creation_done);
        await Promise.all([
            page.waitForNavigation(),
            page.click(selector.pin_creation_done),
        ]);
        await fs.unlink(file_path);

        const pin_url = await page.url();
        console.log(pin_url);
        await page.close();
        return {pin_url,preview_url:`${process.env.DOMAIN}${pin_object.post_slug}`};


    } catch (error) {
        throw error
    }
}

module.exports = {createpin}