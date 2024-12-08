require("dotenv").config();
const { delay } = require("../lib/delay");
const { tel_createpin } = require("./commands/tel_createpin");
const { sendMessage, editMessageText } = require("./lib/sendMessage");

const comandHandler = async (messageobj,browser) => {
  try {
    const command = messageobj.message.text.split(" ");
    console.log(command);
    console.log(`${messageobj.message.date}->${messageobj.message.from.id}->${messageobj.message.from.first_name}->${command[0]}`)

    switch (command[0]) {

      case "/start":
        await sendMessage({
            chat_id: messageobj.message.chat.id,
            parse_mode:"HTML",
            text:`<b> Welcome to RM_master bot 👋 </b>`
        })
        break;

      case "/cp":
        await tel_createpin(messageobj, command[1],browser);
        break;

      default:
        sendMessage({
            chat_id: messageobj.message.chat.id,
            parse_mode:"HTML",
            text:`<b> I never seen this command before 🤔 </b>`
        })
    }

  } catch (error) {
    throw error;
  }
};

module.exports = {comandHandler};
