require("dotenv").config();
const express = require("express");
const { launchBrowser } = require("./lib/browser");
const { createpin } = require("./pintrest/createpin");
const { pintrest_login } = require("./pintrest/pintrestlogin");
const { processRequestFromBot } = require("./lib/midelware");
const { comandHandler } = require("./telegram_bot/comandHandler");
const { sendMessage, deleteMessage } = require("./telegram_bot/lib/sendMessage");
const { getIndianTime } = require("./lib/date_time");
const { delay } = require("./lib/delay");
var server_starting_time = Date.now();
var browser;

const app = express();
app.use(express.json());

app.post("/bot", processRequestFromBot, async (req, res) => {
  try {
    res.send("hello");
    await comandHandler(req.body, browser, server_starting_time);
  } catch (error) {
    console.log(
      `O: [${getIndianTime()}] '${req.body.message.from.first_name}' ${
        req.body.message.from.id
      } [${req.body.message.text}] "ERROR" "${error.message}"`
    );

    var message = await sendMessage({
      chat_id: req.body.message.chat.id,
      parse_mode: "HTML",
      text: `<b>🛑 Seems like some internal server error 🛑 \n_________________________________________</b>
      <i> error occurs while processing 🙁 </i>
      <pre>${req.body.message.text}</pre>`,
    });

  }
});

app.listen(process.env.PORT, async () => {
  try {
    browser = await launchBrowser();
    await pintrest_login(browser);
    console.log(`S: [${getIndianTime()}] `,`Server is running -> http://localhost:${process.env.PORT}`);
  } catch (error) {
    throw error;
  }
});
