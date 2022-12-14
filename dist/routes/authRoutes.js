"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const authController_1 = require("../controllers/authController");
router.get('/me', requireAuth_1.default, authController_1.auth_user);
router.post('/login', authController_1.auth_login);
router.post('/logout', requireAuth_1.default, authController_1.auth_logout);
router.post('/register', authController_1.auth_register);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map