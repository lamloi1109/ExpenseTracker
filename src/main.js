// startup dự án
// chia branch ĐEV

// - Thêm chi phí với mô tả hoạt động và số tiền đi kèm
// commit -m 'feat: Add expense'
// + Xử lý đầu vào
// + Xử lý commander
// + Xử lý đọc ghi file
// + Ghi file
// + Đọc file
// + Chuyển tử chuổi sang json
// + Chuyển từ json sang chuỗi
// + Tạo instance của expense 
// - Id
// - description
// - created_at
// - updated_at
// - amount
// - caterogy
// - max
// - min

// - Cập nhật chi phí
// commit -m 'feat: Update expense'
// Nhân tham số đầu vào
// Xử lý action từ command
// Load dữ liệu từ database
// Tìm expense có id là.... 
// Cập nhật giá trị của id đó
// Ghi lại thay đổi vào file json

// - Xóa chi phí
// commit -m 'feat: Delete expense'
// Tìm id 

// - Xem danh sách tất cả chi phí
// commit -m 'feat: View all expense'

// - Xem tổng của tất cả chi phí
// commit -m 'feat: Sum all expense'

// - Xem tổng của chi phí chỉ đinh theo tháng
// commit -m 'feat: View expense by month'

// - Phân danh mục cho các loại chi phí
// commit -m 'feat: Filter by category'

// - Cho phép người dùng thiết lập giới hạn chi tiêu
// commit -m 'feat: setMaxExpense'

// + Nếu vượt quá giới hạn thì cảnh báo
// commit -m 'feat: Check max'

// + Cho phép người dùng xuất ra định dạng CSV, XLS, ...
// commit -m 'feat: exportData'

// - Chức năng help để giới thiệu về các chức năng trong dự án

const { errorMonitor } = require('events')
const {program} = require('./commander')
const { readFile } = require('fs')
const fs = require('fs').promises
let expenseList = []
const path = `${__dirname}\\Database\\expenseTracker.json`

program
    .command('expense-tracker')
    .description('manager financial')
    .argument('<string...>', 'command')
    .option('--description', 'description', '')
    .option('--amount', 'amount', '')
    .option('--category', 'category', '')
    .option('--created_at', 'created_at', '')
    .option('--updated_at', 'updated_at', '')
    .option('--status', 'status', '')
    .option('--id', 'id', '')
    .action(async (expenses, options) => {
        // Kiêm tra expense không có giá trị

        if (!expenses || expenses.length === 0) {
            showMesage("Invalid command. Please provide an action.", "error")
        }
        // load dữ liệu từ file json
        expenseList = await readData(path)

        // Thêm
        const command = expenses[0]
        const datas = process.argv.slice(4)
        const expense = {}
        for (let index = 1; index <= datas.length; index += 2) {
            const data = datas[index];
            const key = datas[index - 1];
            expense[`${key}`] = data
        }

        // const keyList = options ? Object.keys(options).filter((expense) => options[expense] !== '') : []
        // const expense = keyList.reduce((expense, attribute, index) => {
        //     expense[`${attribute}`] = expenses[index + 1]
        //     return expense
        // }, {})

        const validCommandList =  ['add', 'update', 'delete', 'sum', 'filter', 'exportData']

        if(!validCommandList.includes(command)) {
            showMesage('Invalid command!','error')
            return
        }

        if(command === 'add') {
            const id = getMaxId(expenseList) + 1
            if(!id) {
                showMesage(`Expense doesn't exist.`, 'error')
                return
            }   
            
            expense.id = id
            expense.created_at = getCurrentTime()
            expenseList.push(expense)
            storageData(path, JSON.stringify(expenseList), 'w')
        }

        if(command === 'delete') {
            const id = expense?.id
            console.time('default')

            // expenseList = expenseList.filter((expense) => expense.id != id)
            // Chậm -> O(n) -> Tốn bộ nhớ
            //  Dùng khi cần giữ nguyên mảng gốc

            const index = expenseList.findIndex((expense) => expense.id == id)
            if(index !== -1) {
                expenseList.splice(index, 1)
            }
            // Nhanh hơn O(n) tùy trường hợp tìm thấy index nhanh hay chậm
            // Khi xóa 1 phần tử
            // Trong trường hợp đã khởi tạo map từ đầu thì tốc độ sẽ nhanh hơn
            // const expenseMap = new Map(expenseList.map((expense) => [expense.id, expense]))
            // expenseMap.delete(id)
            // for (let index = 0; index < expenseList.length; index++) {
            //     const expense = expenseList[index];
            //     if(expense.id === id) {
            //         expenseList.splice(index, 1)
            //     }
            // }

            // console.table(expenseList) 
            console.log(`Deleted`)
            console.timeEnd('default')
        }

        if(command === 'update') {
            console.time('update')
            // update cho ai? -> dựa vào điều kiện gì?
            // + Id 
            console.log(expense)
            // + Thông tin upate
            // --id 1 --description abc --amount 10 ...
            // update cái gì?
            // update trong bao lâu
            // làm sao để nhanh hơn
            // update xong thì thông báo cái gì
            console.timeEnd('update')
        }

    })

    function getMaxId(expenseList) {

        if(!Array.isArray(expenseList)) return -1
        
        if (expenseList.length === 0) return 0

        const maxId = expenseList.reduce((id, expense) => {
            const currrentId = expense.id ?? 0
            id = currrentId > id ? currrentId : id
            return id
        }, 0)
        
        return maxId
    }
 
    function getCurrentTime() {
        const currentDate = new Date()

        const year = currentDate.getFullYear()
        const month =  `0${(currentDate.getMonth() + 1)}`.slice(-2)
        const day = `0${currentDate.getDate()}`.slice(-2)
        const hour = currentDate.getHours()
        const minute = currentDate.getMinutes()
        const sencond = currentDate.getSeconds()

        return `${day}/${month}/${year} ${hour}:${minute}:${sencond}`
    }

    function showMesage(message, type) {
        if(type === 'error') {
            console.log(`Error: `)
            console.log(`- ${message}`)
            return
        }
    }

    async function storageData(path, data, mode) {
        try{
            await fs.writeFile(path, data, {flag: mode})
        } catch(error) {
            showMesage("error", `Failed to save data: ${error.message}`)
        }
    }

    async function readData(path) {
        try {
            const data = await fs.readFile(path, 'utf-8')
            return JSON.parse(data)
        } catch(error) {
            showMesage('error', `${error.message}`)
            return []
        }
    }

    function updateExpense() {

    }

program.parse()
