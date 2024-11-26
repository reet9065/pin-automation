require("dotenv").config();
const express = require("express");
const {launchBrowser} =  require("./lib/browser");
const {createpin} = require("./pintrest/createpin");
const { pintrest_login } = require("./pintrest/pintrestlogin");
const { processRequestFromBot } = require("./lib/midelware");
const { comandHandler } = require("./telegram_bot/comandHandler");
const { sendMessage } = require("./telegram_bot/lib/sendMessage");
var browser;

const app = express();
app.use(express.json());


app.post("/bot",processRequestFromBot ,async(req,res)=> {
    // console.log(req.rawHeaders);
    // res.send("hello");
    try {
        await comandHandler(req.body, browser);
        // await createpin(browser,{});
        res.send("hello");
    } catch (error) {
        console.log(error)
        await sendMessage({
            chat_id:req.body.message.chat.id,
            parse_mode:"HTML",
            text:`<b>Seems like some internal server error 🙁</b>`
        })
        res.status(200).json({"error":"Internal server error "});
    }
})

app.listen(process.env.PORT,async() => {
    try {
        browser = await launchBrowser();
        await pintrest_login(browser);
        console.log(`Server is running -> http://localhost:${process.env.PORT}`);
    } catch (error) {
        throw error;
    }
})