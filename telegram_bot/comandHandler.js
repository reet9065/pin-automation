require("dotenv").config();
const { getIndianTime } = require("../lib/date_time");
const { delay } = require("../lib/delay");
const { tel_bulk_createpin } = require("./commands/tel_bulk_createpin");
const { tel_createpin } = require("./commands/tel_createpin");
const { tel_info } = require("./commands/tel_info");
const { sendMessage, editMessageText } = require("./lib/sendMessage");

const comandHandler = async (messageobj, browser, server_starting_time) => {
  try {
    const command = messageobj.message.text.split(" ");

    switch (command[0]) {
      case "/start":
        await sendMessage({
          chat_id: messageobj.message.chat.id,
          parse_mode: "HTML",
          text: `<b> Welcome to RM_master bot 👋 </b>`,
        });
        break;

      case "/cp":
        await tel_createpin(messageobj, command[1], browser);
        break;
      case "/info":
        await tel_info(messageobj, server_starting_time);
        break;
      case "/sbcp":
      case "/bcp":
        await tel_bulk_createpin(messageobj, command[0], command[1], command[2], browser);
        break;
      default:
        sendMessage({
          chat_id: messageobj.message.chat.id,
          parse_mode: "HTML",
          text: `<b> I never seen this command before 🤔 </b>`,
        });
    }

    console.log(
      `O: [${getIndianTime()}] '${messageobj.message.from.first_name}' ${
        messageobj.message.from.id
      } [${messageobj.message.text}] "SUCCESS"`
    );
  } catch (error) {
    throw error;
  }
};

module.exports = { comandHandler };
