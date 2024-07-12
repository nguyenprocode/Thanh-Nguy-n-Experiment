const readline = require('readline');
const { spawn } = require("child_process");
const axios = require("axios");
const bcrypt = require('bcrypt');
const logger = require("./utils/log");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Nhập mật khẩu để chạy file: ', async (password) => {
    const hashedPassword = await bcrypt.hash('TN', 10); 

    const isPasswordCorrect = await bcrypt.compare(password.trim(), hashedPassword);

    if (isPasswordCorrect) {
        console.log('Mật khẩu đúng. Bắt đầu chạy file...');

        const express = require('express');
        const path = require('path');
        const app = express();
        const port = process.env.PORT || 8080;

        app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname, '/index.html'));
        });

        app.listen(port, () => {
            console.log(`\n\nBạn Đang Chạy Bot Trên Host: ${port}`);
        });

        function startBot() {
            const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
                cwd: __dirname,
                stdio: "inherit",
                shell: true
            });

            child.on("close", async (codeExit) => {
                var x = 'codeExit'.replace('codeExit', codeExit);
                if (codeExit == 1) return startBot("Restarting...");
                else if (x.indexOf(2) == 0) {
                    await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2, '')) * 1000));
                    startBot("Open ...");
                }
                else return;
            });

            child.on("error", function (error) {
                logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
            });
        }

        // Kiểm tra cập nhật từ GitHub
        axios.get("https://raw.githubusercontent.com/nguyenprocode/miraiv2/main/package.json")
            .then((res) => {
                logger(res['data']['description'], "◈ Note:");
            })
            .catch((error) => {
                logger("Error fetching data from GitHub: " + error.message, "[ Error ]");
            });

        // Bắt đầu khởi động bot
        startBot();

    } else {
        console.log('Mật khẩu không đúng. Không thể chạy file.');
        rl.close();
    }
});
