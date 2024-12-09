require("dotenv").config();
const fetch = require("node-fetch");


const sendMessage = async(messageobj,url=`${process.env.TELEGRAM_END_POINT}/bot${process.env.BOT_TOKEN}/sendMessage`) => {
    try {
        const respons = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body:JSON.stringify(messageobj)
        })

        if(!respons.ok){
            throw new Error("Can't abel to send message to the client");
        }
        const result = await respons.json();
        return result;
    } catch (error) {
        throw error;
    }
}


const editMessageText = async (messageobj, editedMessage) => {
    try {
        const message = await sendMessage({
            chat_id: messageobj.result.chat.id,
            message_id:messageobj.result.message_id,
            ...editedMessage
        },
        `${process.env.TELEGRAM_END_POINT}/bot${process.env.BOT_TOKEN}/editMessageText`
        )

        return message
    } catch (error) {
        throw error;
    }
}

const deleteMessage = async (messageInfo) => {
    try {
        const respons = await fetch(`${process.env.TELEGRAM_END_POINT}/bot${process.env.BOT_TOKEN}/deleteMessage`,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(messageInfo)
        });

        if(!respons.ok){
            throw new Error("Can't abel to delete message");
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {sendMessage,editMessageText, deleteMessage};