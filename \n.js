module.exports.config = {
  name: "\n",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Thanh Nguyên", // Thay credits làm chó
  description: "sailenh",
  commandCategory: "Hệ Thống",
  usages: "Công cụ",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const request = require('request');
  const fs = require("fs");
  const moment = require("moment-timezone");

  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  const currentTime = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");

  const tnguyen = require('./../../img/videogai.json');
  const image = tnguyen[Math.floor(Math.random() * tnguyen.length)].trim();

  function downloadImage(imageUrl, outputPath, callback) {
    request(imageUrl).pipe(fs.createWriteStream(__dirname + `/${outputPath}`)).on("close", callback);
  }

  function sendMessageWithImage() {
    api.sendMessage({
      body: `\n Thời gian hoạt động: \n ${hours}:${minutes}:${seconds}`,
      attachment: fs.createReadStream(__dirname + `/video.mp4`)
    }, event.threadID, () => {
      fs.unlinkSync(__dirname + `/video.mp4`);
    }, event.messageID);
  }

  downloadImage(image, 'video.mp4', sendMessageWithImage);
};
