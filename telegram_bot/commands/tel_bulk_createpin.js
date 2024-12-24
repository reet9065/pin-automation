require("dotenv").config();
const { delay } = require("../../lib/delay");
const { createpin } = require("../../pintrest/createpin");
const { get_data_from_wpapi } = require("../../wp/wpAPI");
const { sendMessage, editMessageText } = require("../lib/sendMessage");

var current_running_bulk = null;


var task_status = {
    total_task : 0,
    total_excution: 0,
    completed : 0,
    total_failed:0

}


const excute_task = async( browser , next_task, message , task_length) => {

    if(current_running_bulk === null){
        return;
    }

    task_status.total_task = task_length;
    task_status.total_excution = task_status.total_excution + 1;

    try {

        const post_obj = await get_data_from_wpapi(next_task);

        const pin = await createpin(browser,post_obj);

        task_status.completed = task_status.completed + 1;


    } catch (error) {
        task_status.total_failed = task_status.total_failed + 1;
    };

    await editMessageText(message,{
        text:`[ ⏳Bulk pin creation in progress... ] \n\n 🗒 Total task left : ${task_status.total_task} \n 📝 Total excution: ${task_status.total_excution} \n 👍 Task completed: ${task_status.completed} \n 👎 Task failed: ${task_status.total_failed}`
    });
}


const tel_bulk_createpin = async(messageObj, command, siteMapUrl, exceptCount, browser) => {
    try {

        var POST_LIST = [];
        var message;

        if(command === "/sbcp"){

            if(current_running_bulk === null){
                await sendMessage({
                    chat_id: messageObj.message.chat.id,
                    text: 'There is no bulk operation for stop !! 🤔',
                });

                return;
            }

            await sendMessage({
                chat_id: messageObj.message.chat.id,
                text: `Bulk operation for sitemap url \n ${current_running_bulk.url} \n 🔴Now Stoped🔴`,
            });

            current_running_bulk = null;

            return;

        }

        if(!siteMapUrl){
            throw new Error("Please provide a site-map url");
        }

        if(!siteMapUrl.includes("https://")){
            throw new Error("Seems like not a valid URL Please provide a valid URL");
        };


        if( current_running_bulk === null ){

            task_status = {
                total_task : 0,
                total_excution: 0,
                completed : 0,
                total_failed:0
            
            }

            current_running_bulk = {
                url:siteMapUrl,
                message: `Bulk pin process about to start please wait...`
            };

            message = await sendMessage({
                chat_id: messageObj.message.chat.id,
                text: current_running_bulk.message,
            });

            const page = await browser.newPage();
            await page.goto(siteMapUrl, {
                waitUntil:'domcontentloaded'
            });
    
            await page.waitForSelector("#sitemap > tbody > tr > td > a");

            await delay(3000);
    
            POST_LIST = await page.$$eval('#sitemap > tbody > tr > td > a', (posts) => {
                return posts.map((post) => post.textContent);
            });


    
            page.close();

            if(exceptCount){
                for(let i = 0; i <= parseInt(exceptCount); i++){
                    POST_LIST.shift();
                }
            }


        }else {

            await sendMessage({
                chat_id: messageObj.message.chat.id,
                text: "A pin creation task is already running!!",
            });

            return;
        }

        // var parllel_limit = 1;
        // var task_batch = [];

        // const task_runner = async() => {

        //     if(current_running_bulk === null){
        //         return;
        //     }
                
        //     if(POST_LIST.length === 0){
        //         return;
        //     };

        //     var next_task = POST_LIST.shift();

        //     task_batch.push(excute_task(browser ,next_task, message, POST_LIST.length).then(() => {
        //         task_runner();
        //     }));

        //     if(task_batch.lenght >= parllel_limit){
        //         await Promise.race(task_batch);
        //     };

        // };
        
        // for(let i = 0; i < parllel_limit; i++){
        //     task_runner();
        // }

        // // The above code is for parellal task excution but the copy cliboard is a issu for that

        while(POST_LIST.length > 0){

          if (current_running_bulk === null) {
            return;
          }

          if (POST_LIST.length === 0) {
            return;
          }

          var next_task = POST_LIST.shift();

          await excute_task(browser,next_task,message,POST_LIST.length);

        }

        // await Promise.all(task_batch);
        
        await editMessageText(message,{
            text:`[ 👍 Bulk pin creation completed 👏👏 ] \n\n 🗒 Total task left : ${task_status.total_task} \n 📝 Total excution: ${task_status.total_excution} \n 👍 Task completed: ${task_status.completed} \n 👎 Task failed: ${task_status.total_failed}`
        });

        current_running_bulk = null;
        

    } catch (error) {
       throw error;
    }
}

module.exports = {tel_bulk_createpin};


