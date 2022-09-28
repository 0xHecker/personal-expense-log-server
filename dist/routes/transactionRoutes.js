"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
router.post('/transaction', transactionController_1.transaction_post);
router.delete('/transaction/delete/:transactionId', transactionController_1.transaction_delete);
router.get('/transactions', transactionController_1.transactions_get);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map