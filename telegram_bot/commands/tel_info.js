const { getSystemAndNodeStats } = require("../../lib/resource_usage_info");
const { sendMessage } = require("../lib/sendMessage");

const tel_info = async (messageObj,server_starting_time) => {
  try {
    var sys_info = await getSystemAndNodeStats(server_starting_time);

    var text = ` [ System Info ]🤖 \n\n 🖥️ CPU: ${sys_info.cpu.totalSystemUsagePercentage}% \n 🎞️ RAM: T- [ ${sys_info.memory.total.toFixed(1)}GB ] / U- [ ${sys_info.memory.used.toFixed(1)}GB ] \n 💽 DISK: ${sys_info.disk[0].total}GB / ${sys_info.disk[0].used}GB\n\n 🕰️ UP_TIME: ${sys_info.serverUptime}`;

    await sendMessage({
      chat_id: messageObj.message.chat.id,
      text: text,
    });

  } catch (error) {
    throw error;
  }
};

module.exports = { tel_info };
