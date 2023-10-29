const Transactions = require('../models/transactions');

const calculateAccountBalance = async (accountId) => {
    const accountTransactions = await Transactions.find({
        accountId,
        type: { $in: ['income', 'expense'] },
        'removed.isRemoved': false,
    });

    let balance = 0;
    accountTransactions.forEach((transaction) => {
        if (transaction.type === 'income') {
            balance += transaction.amount;
        } else if (transaction.type === 'expense') {
            balance -= transaction.amount;
        }
    });

    return balance;
};

module.exports = {
    calculateAccountBalance
};