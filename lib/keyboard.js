require("dotenv").config();

const keyboardType = async(page,string) => {
    try {
        await page.keyboard.type(string);
    } catch (error) {
        throw error;
    }
}

const keyPresser = async (page,key,count=1) => {
    try {
        for(let i = 0; i <= count; i++){
            await page.keyboard.press(key);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {keyPresser,keyboardType};