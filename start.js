rl.question('Nhập mật khẩu để chạy file: ', async (password) => {
    const hashedPassword = await bcrypt.hash('TN', 10); 
