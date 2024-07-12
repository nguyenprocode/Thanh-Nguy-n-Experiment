const readline = require('readline');
const bcrypt = require('bcrypt');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Nhập mật khẩu để chạy file: ', async (password) => {
    const hashedPassword = await bcrypt.hash('TN', 10); // Replace 'TN' with your actual password

    console.log('Hashed password:', hashedPassword);
    
    // You can perform other actions here based on the hashed password
    rl.close();
});
