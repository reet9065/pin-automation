const os = require('os');
const si = require('systeminformation');


// Function to get system and node application stats
async function getSystemAndNodeStats(serverStartTime) {
  const stats = {};

  // Calculate server uptime in hours and minutes
  const uptimeMs = Date.now() - serverStartTime;
  const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60)); // Get hours
  const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

  stats.serverUptime = `${uptimeHours} hours ${uptimeMinutes} minutes`;

  try {
    // CPU usage info (System-wide)
    const cpuUsage = await si.currentLoad();
    stats.cpu = {
      totalSystemUsagePercentage: cpuUsage.currentLoad ? cpuUsage.currentLoad.toFixed(2) : "N/A", // Total system CPU usage
      systemLoadPercentage: cpuUsage.systemLoad ? cpuUsage.systemLoad.toFixed(2) : "N/A", // System CPU load
      userLoadPercentage: cpuUsage.userLoad ? cpuUsage.userLoad.toFixed(2) : "N/A" // User CPU load
    };
  } catch (err) {
    stats.cpu = { error: 'Error fetching CPU usage' };
  }

  try {
    // CPU usage for Node.js process
    const nodeCpuUsage = process.cpuUsage();
    const nodeCpuTime = (nodeCpuUsage.user + nodeCpuUsage.system) / 1000;  // CPU time in milliseconds
    stats.nodeCpu = {
      usage: nodeCpuTime ? nodeCpuTime.toFixed(2) : "N/A" // CPU time used by the Node process (in ms)
    };
  } catch (err) {
    stats.nodeCpu = { error: 'Error fetching Node.js CPU usage' };
  }

  try {
    // Memory info (System-wide)
    const totalMem = os.totalmem() / (1024 * 1024 * 1024); // Total system memory in GB
    const freeMem = os.freemem() / (1024 * 1024 * 1024);  // Free system memory in GB
    stats.memory = {
      total: totalMem,
      free: freeMem,
      used: totalMem - freeMem,
      freePercentage: ((freeMem / totalMem) * 100).toFixed(2),  // Free memory as percentage
      usedPercentage: (((totalMem - freeMem) / totalMem) * 100).toFixed(2)  // Used memory as percentage
    };
  } catch (err) {
    stats.memory = { error: 'Error fetching memory usage' };
  }

  try {
    // Memory usage for Node.js process
    const nodeMemory = process.memoryUsage();
    stats.nodeMemory = {
      rss: (nodeMemory.rss / (1024 * 1024)).toFixed(2),  // Resident Set Size (in MB)
      heapTotal: (nodeMemory.heapTotal / (1024 * 1024)).toFixed(2), // Total heap memory (in MB)
      heapUsed: (nodeMemory.heapUsed / (1024 * 1024)).toFixed(2),   // Used heap memory (in MB)
      external: (nodeMemory.external / (1024 * 1024)).toFixed(2)    // External memory (in MB)
    };
  } catch (err) {
    stats.nodeMemory = { error: 'Error fetching Node.js memory usage' };
  }

  try {
    // Disk info (System-wide)
    const diskInfo = await si.fsSize();
    stats.disk = diskInfo.map(disk => ({
      mount: disk.mount,
      total: (disk.size / (1024 * 1024 * 1024)).toFixed(2), // Total disk size in GB
      used: (disk.used / (1024 * 1024 * 1024)).toFixed(2), // Used disk space in GB
      free: (disk.available / (1024 * 1024 * 1024)).toFixed(2), // Free disk space in GB
      freePercentage: ((disk.available / disk.size) * 100).toFixed(2), // Free disk as percentage
      usedPercentage: ((disk.used / disk.size) * 100).toFixed(2) // Used disk as percentage
    }));
  } catch (err) {
    stats.disk = { error: 'Error fetching disk usage' };
  }

  stats.nodeDisk = {
    usage: "Not directly available" // Disk usage per Node.js process is difficult to track
  };



  return stats;
}

module.exports = {getSystemAndNodeStats};


// setInterval(async()=>{
//     var info = await getSystemAndNodeStats();
//     console.log(info);
// },5000);



// {
//     serverUptime: '0 hours 4 minutes',
//     cpu: {
//       totalSystemUsagePercentage: '3.36',
//       systemLoadPercentage: 'N/A',
//       userLoadPercentage: 'N/A'
//     },
//     nodeCpu: { usage: '794.42' },
//     memory: {
//       total: 11.587955474853516,
//       free: 7.89508056640625,
//       used: 3.6928749084472656,
//       freePercentage: '68.13',
//       usedPercentage: '31.87'
//     },
//     nodeMemory: {
//       rss: '48.61',
//       heapTotal: '6.72',
//       heapUsed: '5.69',
//       external: '1.45'
//     },
//     disk: [
//       {
//         mount: '/',
//         total: '219.00',
//         used: '153.17',
//         free: '54.63',
//         freePercentage: '24.95',
//         usedPercentage: '69.94'
//       }
//     ],
//     nodeDisk: { usage: 'Not directly available' }
//   }