require("dotenv").config();
const { sendMessage } = require("../telegram_bot/lib/sendMessage");


// const telIP = "91.108.6.90";

const processRequestFromBot = async (req, res, next) => {
  try {
    // if (!req.rawHeaders.includes(telIP)) {
    //   res.status(403).json({ error: { message: "permission denide" } });
    //   return;
    // }

    if(!process.env.PERMISSION_ID.includes(`${req.body.message.from.id}`)){
      await sendMessage({
        chat_id:req.body.message.chat.id,
        text:"Permission denied"
      })
      res.status(200).json({ error: { message: "permission denied" }});
      return
    }

    if (req.body.message.text[0] !== "/") {
      
      console.log(`${req.body.message.date}->${req.body.message.from.id}->${req.body.message.from.first_name}->${req.body.message.text}->Invalid Command`)
        
      const message = await sendMessage({
        chat_id:req.body.message.chat.id,
        text:"Please provide a vaild command to process your request"
      })
      console.log(message);
      res.status(200).json({ error: { message: "Not a vailed command" }});
      return
    }

    next();
  } catch (error) {
    throw error
  }
};

module.exports = { processRequestFromBot };
