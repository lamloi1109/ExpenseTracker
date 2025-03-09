const {Command} = require('commander')
const program = new Command()

program
    .name('expenseTracker')
    .description('Build a simple expense tracker application to manage your finances. The application should allow users to add, delete, and view their expenses. The application should also provide a summary of the expenses')
    .version('1.0.0')


exports.program = program