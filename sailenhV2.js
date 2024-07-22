const request = require('request');
const fs = require("fs");
const moment = require("moment-timezone");

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
  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  const currentTime = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");

  const tnguyen = require('./../../Data_BTN/datajson/videogai.json');
  const videoCount = tnguyen.length; // Tổng số video
  const videoPath = __dirname + `/video.mp4`;

  // Đọc số video đã gửi từ tệp tin
  const sentCountFilePath = __dirname + '/sent_count.json';
  let sentCount = 0;

  if (fs.existsSync(sentCountFilePath)) {
    const data = fs.readFileSync(sentCountFilePath, 'utf8');
    sentCount = parseInt(data, 10);
  }

  const videoIndex = (sentCount % videoCount);
  const videoUrl = tnguyen[videoIndex].trim();

  function downloadVideo(videoUrl, outputPath, callback) {
    request(videoUrl).pipe(fs.createWriteStream(outputPath)).on("close", callback);
  }

  function sendMessageWithVideo() {
    api.sendMessage({
      body: `\n⚠ Chưa Nhập Tên Lệnh.\n🕰️ Thời gian hoạt động: \n${hours}:${minutes}:${seconds}\n🎁 Tổng số video hiện có: ${videoCount}\n🌀 Số video đã gửi: ${sentCount + 1}`,
      attachment: fs.createReadStream(videoPath)
    }, event.threadID, () => {
      fs.unlinkSync(videoPath);

      // Cập nhật số video đã gửi
      fs.writeFileSync(sentCountFilePath, (sentCount + 1).toString(), 'utf8');
    }, event.messageID);
  }

  downloadVideo(videoUrl, videoPath, sendMessageWithVideo);
};
