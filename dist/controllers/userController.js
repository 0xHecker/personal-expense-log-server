"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_delete = exports.user_update_password = exports.user_update_profile = void 0;
const config_1 = __importDefault(require("../constants/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_update_profile = async (req, res) => {
    const { firstName, lastName } = req.body;
    if (req.session.userId) {
        try {
            await config_1.default.user.update({
                where: {
                    id: req.session.userId,
                },
                data: {
                    firstName,
                    lastName,
                },
            });
            res.status(200).send('updated');
        }
        catch (err) {
            console.log(err);
            res.status(500).send('Error updating data');
        }
    }
    else {
        res.status(401).send('You must be logged in to do tha t');
    }
};
exports.user_update_profile = user_update_profile;
const user_update_password = async (req, res) => {
    const { password, oldPassword } = req.body;
    let user;
    if (req.session.userId) {
        try {
            user = await config_1.default.user.findUnique({
                where: {
                    id: req.session.userId,
                },
            });
        }
        catch (_a) {
            res.status(500).send('error updating password');
            return;
        }
    }
    else {
        res.status(401).send('You must be login to do that');
    }
    if (user) {
        const isPasswordCorrect = await bcrypt_1.default.compare(oldPassword, user.password);
        if (isPasswordCorrect) {
            const saltRounds = 10;
            let newPassword = await bcrypt_1.default.hash(password, saltRounds);
            try {
                await config_1.default.user.update({
                    where: {
                        id: req.session.userId,
                    },
                    data: {
                        password: newPassword,
                    },
                });
            }
            catch (_b) {
                res.status(500).send('Cannot update the password');
            }
        }
        else {
            res.status(403).send('wrong password');
        }
    }
};
exports.user_update_password = user_update_password;
const user_delete = async (req, res) => {
    const userId = req.session.userId;
    req.session.destroy((err) => {
        if (err)
            res.status(500).send('Cannot destroy session');
        else
            res.status(200).send('Deleted');
    });
    await config_1.default.user.delete({
        where: {
            id: userId,
        },
    });
};
exports.user_delete = user_delete;
//# sourceMappingURL=userController.js.map