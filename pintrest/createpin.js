require('dotenv').config();
const { delay } = require("../lib/delay");
const { keyboardType, keyPresser } = require('../lib/keyboard');
const path = require("path");
const { get_data_from_wpapi } = require("../wp/wpAPI");
const { launchBrowser } = require('../lib/browser');
const { pintrest_login } = require('./pintrestlogin');
const fs = require("fs/promises")
// const {launchBrowser} = require("../lib/browser");

const selector = {
    file: "input[type = file]",
    title: "input[id = storyboard-selector-title]",
    description: 'xpath///*[@data-test-id="comment-editor-container"]/div/div[2]/div/div/div/div',
    link: "input[id = WebsiteField]",
    board: 'xpath///*[@data-test-id="board-dropdown-select-button"]',
    tags: 'xpath///*[@id="storyboard-selector-interest-tags"]',
    submit_btn: 'xpath///*[@data-test-id="storyboard-creation-nav-done"]/button/div/div',
    pin_creation_done: 'xpath///*[@data-test-id="toast"]/a/div/div/div/div[3]/button/div/div',
    pin_draft_card: `['data-test-id^=pinDraft-']`,
    pin_draft_count: `#__PWS_ROOT__ > div > div:nth-child(1) > div > div.appContent > div > div > div > div.hs0.un8.C9i.TB_ > div.LJB.Pw5._he.daS.imm.oy8.zI7.iyn.Hsu > div > div.Eqh.zI7.iyn.Hsu > div.Jea.KS5.i1W.jzS.zI7.iyn.Hsu > div.Kzl.zI7.iyn.Hsu > div > div.X8m.zDA.IZT.tBJ.dyH.iFc.bwj.swG`,
    pin_draft_selectAll_btn: `xpath///*[@id="storyboard-drafts-sidebar-bulk-select-checkbox"]`,
    pin_draft_delete_btn: `#__PWS_ROOT__ > div > div:nth-child(1) > div > div.appContent > div > div > div > div.hs0.un8.C9i.TB_ > div.LJB.Pw5._he.daS.imm.oy8.zI7.iyn.Hsu > div > div.Jea.KS5.Kzl.b8T.i1W.zI7.iyn.Hsu > div.hs0.un8.b23.JrK > div:nth-child(1) > div > button`,
    pin_draft_delete_conformation_btn: `div[data-test-id="modal-confirm-button"] > button`,
    pin_draft_expand_btn: `#__PWS_ROOT__ > div > div:nth-child(1) > div > div.appContent > div > div > div > div.hs0.un8.C9i.TB_ > div.LJB.Pw5._he.daS.imm.oy8.zI7.iyn.Hsu > div > div > div:nth-child(1) > button`,
    pin_draft_collaps_btn: `#__PWS_ROOT__ > div > div:nth-child(1) > div > div.appContent > div > div > div > div.hs0.un8.C9i.TB_ > div.LJB.Pw5._he.daS.imm.oy8.zI7.iyn.Hsu > div > div.Eqh.zI7.iyn.Hsu > div.Jea.KS5.i1W.jzS.zI7.iyn.Hsu > div.Kzl.zI7.iyn.Hsu > div > div.zI7.iyn.Hsu > button`
}

const tags = " Season  download,  Season  hindi download, download  Season  720p,  Season  480p download, download   Season  1080p hd,  Season  hindi dubbed download,  Season  full movie download, download  Season  hindi,  Season  download moviesflix,  Season  download moviesverse,  Season  download in hindi,  Season  download movie,  Season  movie english download,  Season  movie download link,  Season  300mb dual audio,  Season  480p hindi dubbed download,  Season  dual audio download,  Season  google drive link,  Season  english with subtitles download, download  Season  english subtitles,   Season  movie download katmoviehd,  Season  movie download themoviesflix,  Season  download filmywap,  Season  download worldfree4u, download  Season  movie khatrimaza, download  Season  torrent, 480p movies download, 720p hd movies, 300 mb movies, 1080p bluray movies, hindi dubbed movies, 1080p movies, 720p movies, 2019 Movies, 300mb Movies, 480p Movies, Dual Audio Movies,  hollywood movies download, download  Season";

const paste_in_input = async (page, string_text, selector) => {

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

const createpin = async (browser, pin_object) => {
    var page;
    var draft_limit = 15;

    try {

        // browser = await launchBrowser();
        // await pintrest_login(browser);
        // pin_object = await get_data_from_wpapi("https://privatemoviez.cam/spy-kids-collection-2001-2011-720p/");

        page = await browser.newPage();
        await page.goto(process.env.CREATE_PIN_URL, {
            waitUntil: 'domcontentloaded'
        });
        
        var isPinDraftExpanded;
        
        try {
            isPinDraftExpanded = await page.waitForSelector(selector.pin_draft_count, { timeout: 10000 });
        } catch (error) {
            isPinDraftExpanded = null;            
        }

        if (isPinDraftExpanded) {
            await delay(500);

            var draft_count = await page.$eval(selector.pin_draft_count, el => {
                return el.innerText;
            });

            draft_count = draft_count.split("(")[1];

            if (draft_count) {
                draft_count = draft_count.substr(0, draft_count.length - 1);
            } else {
                draft_count = "0";
            }

            draft_count = parseInt(draft_count);

            if (draft_count > draft_limit) {
                await page.waitForSelector(selector.pin_draft_selectAll_btn);
                await page.click(selector.pin_draft_selectAll_btn);

                await page.waitForSelector(selector.pin_draft_delete_btn);
                await page.click(selector.pin_draft_delete_btn);

                await page.waitForSelector(selector.pin_draft_delete_conformation_btn);
                await page.click(selector.pin_draft_delete_conformation_btn);

                await delay(1000);
            }

        }


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

        await fs.unlink(file_path);

        await page.waitForSelector(selector.pin_creation_done);
        await Promise.all([
            page.waitForNavigation(),
            page.click(selector.pin_creation_done),
        ]);


        const pin_url = await page.url();
        await page.close();
        return {pin_url,preview_url:`${process.env.DOMAIN}${pin_object.post_slug}`};


    } catch (error) {
        page.close();
        throw error;
    }
}

module.exports = {createpin}

// createpin();