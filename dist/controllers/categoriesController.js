"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category_delete = exports.categories_post = exports.categories_transaction_sum = exports.categories_get = void 0;
const config_1 = __importDefault(require("../constants/config"));
const luxon_1 = require("luxon");
const categories_get = async (req, res) => {
    let ctgs;
    try {
        ctgs = await config_1.default.transactionCategory.findMany();
        if (ctgs)
            res.status(200).json({ ctgs });
    }
    catch (_a) {
        res.status(400).json({ message: 'Something Went Wrong' });
    }
};
exports.categories_get = categories_get;
const categories_post = async (req, res) => {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Please Enter a Name' });
    try {
        const ctgs = await config_1.default.transactionCategory.create({
            data: {
                name: name,
                userId: req.session.userId,
            },
        });
        res.status(201).json(ctgs);
    }
    catch (e) {
        if (e.code === 'P2002') {
            res.status(400).json({ message: 'Category Already Exists' });
        }
        else {
            res.status(400).json({ message: 'Something Went Wrong' });
        }
    }
};
exports.categories_post = categories_post;
const category_delete = async (req, res) => {
    const { categoryId } = req.params;
    console.log(req.params);
    if (!categoryId)
        return res.status(400).json({ message: 'Please Enter a Name' });
    try {
        await config_1.default.transactionCategory.deleteMany({
            where: {
                id: categoryId,
                userId: req.session.userId,
            },
        });
        res.status(200).json({ message: `Deleted Category with id ${categoryId}` });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Something Went Wrong' });
    }
};
exports.category_delete = category_delete;
const categories_transaction_sum = async (req, res) => {
    let firstDate = req.query.first;
    let lastDate = luxon_1.DateTime.now().toISO();
    if (!firstDate) {
        firstDate = luxon_1.DateTime.now().minus({ month: 1 }).toISO();
    }
    try {
        const transactions = await config_1.default.transaction.groupBy({
            by: ['transactionCategoryId'],
            _sum: {
                money: true,
            },
            where: {
                userId: req.session.userId,
                date: {
                    gte: firstDate,
                    lt: lastDate,
                },
            },
        });
        const categories = await config_1.default.transactionCategory.findMany({
            where: {
                userId: req.session.userId,
            },
        });
        const categoriesWithSum = categories.map((category) => {
            const transaction = transactions.find((transaction) => transaction.transactionCategoryId === category.id);
            return Object.assign(Object.assign({}, category), { sum: transaction ? transaction._sum.money : 0 });
        });
        res.status(200).json(categoriesWithSum);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Something Went Wrong' });
    }
};
exports.categories_transaction_sum = categories_transaction_sum;
//# sourceMappingURL=categoriesController.js.map