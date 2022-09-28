"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const userController_1 = require("../controllers/userController");
router.use(requireAuth_1.default);
router.patch('/updateprofile', userController_1.user_update_profile);
router.patch('/updateprofile/password', userController_1.user_update_password);
router.patch('/userprofile/delete', userController_1.user_delete);
exports.default = router;
//# sourceMappingURL=userRouter.js.map