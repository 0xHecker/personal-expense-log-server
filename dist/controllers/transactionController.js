"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction_delete = exports.transactions_get = exports.transaction_post = void 0;
const config_1 = __importDefault(require("../constants/config"));
const luxon_1 = require("luxon");
const transaction_post = async (req, res) => {
    const { title, money, date, info, transactionCategoryId } = req.body;
    if (req.session.userId) {
        const wallet = await config_1.default.wallet
            .findUnique({
            where: {
                userId: req.session.userId,
            },
        })
            .catch();
        try {
            await config_1.default.transaction.create({
                data: {
                    title,
                    money: parseFloat(money),
                    date: luxon_1.DateTime.fromISO(date).toJSDate(),
                    info,
                    transactionCategoryId: transactionCategoryId,
                    userId: req.session.userId,
                },
            });
            res.status(200).send('Transaction added');
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Something went wrong' });
        }
    }
};
exports.transaction_post = transaction_post;
const transactions_get = async (req, res) => {
    let { firstDate, lastDate, category, dateSort, priceSort, take, skip } = req.query;
    if (!Number(skip)) {
        skip = 0;
    }
    if (!Number(take)) {
        take = 5;
    }
    try {
        const transactions = await config_1.default.transaction.findMany({
            where: {
                userId: req.session.userId,
                date: {
                    gte: firstDate != undefined
                        ? luxon_1.DateTime.fromISO(firstDate).toISO()
                        : luxon_1.DateTime.now().minus({ days: 30 }).toISO(),
                    lt: lastDate != undefined
                        ? luxon_1.DateTime.fromISO(lastDate).toISO()
                        : luxon_1.DateTime.now().toISO(),
                },
                transactionCategoryId: category,
            },
            skip: parseInt(skip),
            take: parseInt(take) + 1,
            orderBy: {
                date: dateSort !== null && dateSort !== void 0 ? dateSort : undefined,
                money: priceSort !== null && priceSort !== void 0 ? priceSort : undefined,
            },
            select: {
                title: true,
                money: true,
                date: true,
                info: true,
                id: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.json({
            transactions: (transactions === null || transactions === void 0 ? void 0 : transactions.length) > take ? transactions.slice(0, -1) : transactions,
            hasMore: transactions.length > take ? true : false,
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.transactions_get = transactions_get;
const transaction_delete = async (req, res) => {
    const transactionId = req.params.transactionId;
    let tr;
    try {
        tr = await config_1.default.transaction.deleteMany({
            where: {
                id: transactionId,
                userId: req.session.userId,
            },
        });
        res.status(200).send('success');
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.transaction_delete = transaction_delete;
//# sourceMappingURL=transactionController.js.map