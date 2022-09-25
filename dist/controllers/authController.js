"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_user = exports.auth_logout = exports.auth_register = exports.auth_login = void 0;
const config_1 = __importDefault(require("../constants/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_login = async (req, res) => {
    let user;
    const { email } = req.body;
    const { password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Fields Missing' });
        return;
    }
    try {
        user = await config_1.default.user.findUnique({
            where: {
                email,
            },
        });
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (isPasswordCorrect) {
            req.session.userId = user === null || user === void 0 ? void 0 : user.id;
            res.status(200).send('Authenticated');
        }
    }
    catch (_a) {
        res.status(401).json('Invalid credentials');
        return;
    }
};
exports.auth_login = auth_login;
const auth_register = async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    const { firstName } = req.body;
    if (!email || !password || !firstName) {
        res.status(400).json({ message: 'Fields Missing' });
        return;
    }
    let emailCheck;
    try {
        emailCheck = await config_1.default.user.findUnique({
            where: {
                email,
            },
        });
    }
    catch (_a) {
        res
            .status(400)
            .send([{ instancePath: 'Email Availability', message: 'Error' }]);
    }
    if (emailCheck) {
        res
            .status(400)
            .send([{ instancePath: 'Email', message: 'Email is already taken' }]);
    }
    else {
        const saltRounds = 10;
        let salted_password = await bcrypt_1.default.hash(password, saltRounds);
        let newUser;
        try {
            newUser = await config_1.default.user.create({
                data: {
                    email: email,
                    password: salted_password,
                    firstName,
                    lastName: '',
                },
            });
        }
        catch (_b) {
            res.status(500).send([{ instancePath: 'Err', message: 'Err' }]);
            return;
        }
        try {
            await config_1.default.wallet.create({
                data: {
                    userId: newUser === null || newUser === void 0 ? void 0 : newUser.id,
                },
            });
            res.status(200).send('new user created');
        }
        catch (_c) {
            res.status(400).send('error creating user');
        }
    }
};
exports.auth_register = auth_register;
const auth_logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err)
            res.status(500).send('Cannot destroy session');
        else
            res.status(200).send('Deleted');
    });
};
exports.auth_logout = auth_logout;
const auth_user = async (req, res) => {
    try {
        const user = await config_1.default.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });
        if (!user)
            res.status(401).json('User Not Found');
        const data = {
            email: user === null || user === void 0 ? void 0 : user.email,
            userId: user === null || user === void 0 ? void 0 : user.id,
            firstName: user === null || user === void 0 ? void 0 : user.firstName,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
        };
        res.status(200).json(data);
    }
    catch (_a) {
        res.status(500).json('Something Went Wrong {auth}');
    }
};
exports.auth_user = auth_user;
//# sourceMappingURL=authController.js.map