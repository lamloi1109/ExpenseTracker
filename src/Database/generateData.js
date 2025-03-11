const fs = require('fs');

const generateData = (count) => {
    const data = [];

    for (let i = 1; i <= count; i++) {
        data.push({
            id: i,
            description: `Expense ${i}`,
            amount: (Math.random() * 1000).toFixed(2), // Random số tiền
            created_at: new Date().toLocaleString('vi-VN'), // Lấy thời gian hiện tại
        });
    }

    return data;
};

const data = generateData(1000000);

// Ghi dữ liệu vào file expenseTracker.json
fs.writeFileSync('expenseTracker.json', JSON.stringify(data, null, 2), 'utf-8');

console.log('✅ File expenseTracker.json đã được tạo thành công với 100,000 bản ghi!');
