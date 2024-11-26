require("dotenv").config();
const { createpin } = require("../../pintrest/createpin");
const { get_data_from_wpapi } = require("../../wp/wpAPI");
const { sendMessage, editMessageText } = require("../lib/sendMessage");



const tel_createpin = async(messageObj, postUrl, browser) => {
    try {
        var text = `<b>⌛ Creating pin please wait...</b>`

        if( !postUrl || postUrl.trim() === ""|| !postUrl.includes("https://")){
            text = `<b>Please provide a valid url 🥲\n ____________________________\n</b><strong>example: /createpin https://your-post-url </strong>`
            await sendMessage({
                chat_id: messageObj.message.chat.id,
                text: text,
                parse_mode:"HTML",
            })
            return;
        }

        const message = await sendMessage({
            chat_id: messageObj.message.chat.id,
            text: text,
            parse_mode:"HTML"
        })

        const post_obj = await get_data_from_wpapi(postUrl);

        const pin = await createpin(browser,post_obj);

        const editMessage = await editMessageText(message,{
            text:`Pin created Successfully !! 👏 \n ________________________\n${pin.pin_url}`,
            link_preview_options:{
                is_disabled:false,
                url: pin.preview_url,
                prefer_large_media:true,
                show_above_text:true
            }
        })


    } catch (error) {
        throw error;
    }
}

module.exports = {tel_createpin};
