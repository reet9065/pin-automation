require("dotenv").config();
const { sendMessage } = require("../telegram_bot/lib/sendMessage");
const { getIndianTime } = require("./date_time");


// const telIP = "91.108.6.90";

const processRequestFromBot = async (req, res, next) => {
  try {
    // if (!req.rawHeaders.includes(telIP)) {
    //   res.status(403).json({ error: { message: "permission denide" } });
    //   return;
    // }

    if(!req.body.message.from.id){
      res.status(400).json({error: { message : "Bad request"}});
    }
    console.log(`I: [${getIndianTime()}] '${req.body.message.from.first_name}' ${req.body.message.from.id} [${req.body.message.text}]`)
    if(!process.env.PERMISSION_ID.includes(`${req.body.message.from.id}`)){
    console.log(`O: [${getIndianTime()}] '${req.body.message.from.first_name}' ${req.body.message.from.id} [${req.body.message.text}] "UNAUTHORIZED"` );
      await sendMessage({
        chat_id:req.body.message.chat.id,
        text:"Permission denied"
      })
      res.status(200).json({ error: { message: "permission denied" }});
      return
    }

    if (req.body.message.text[0] !== "/") {
      console.log(`O: [${getIndianTime()}] '${req.body.message.from.first_name}' ${req.body.message.from.id} [${req.body.message.text}] "BAD_REQUEST"`)
      const message = await sendMessage({
        chat_id:req.body.message.chat.id,
        text:"Please provide a valid command to process your request"
      })
      res.status(200).json({ error: { message: "Not a vailed command" }});
      return
    }

    next();
  } catch (error) {
    throw error
  }
};

module.exports = { processRequestFromBot };
