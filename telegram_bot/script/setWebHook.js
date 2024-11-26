require("dotenv").config();
const fetch = require("node-fetch");
const argument = process.argv[2]; // Url tunnel interface


const setwebHook = async() => {
    try {
        const respons = await fetch(`${process.env.TELEGRAM_END_POINT}/bot${process.env.BOT_TOKEN}/setWebhook?url=${argument}/`);

        if(!respons.ok){
            console.log(respons);
            throw new Error("Something went wrong can't abel to setWebhook. Try agin !!")
        }

        const result = await respons.json();

        console.log(result);

    } catch (error) {
        throw error
    }
}


if(!argument){
    console.log("set-webhook need a tunnel interface url: npm run set-webhook -- <Tunnel-Interface_url>");
}else{
    setwebHook();
}