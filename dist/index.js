"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./constants/config"));
const express_session_1 = __importDefault(require("express-session"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://localhost:8080'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
    credentials: true,
}));
app.set('trust proxy', 1);
app.use((0, express_session_1.default)({
    name: 'cookiee',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new prisma_session_store_1.PrismaSessionStore(config_1.default, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', authRoutes_1.default);
app.use('/api', userRouter_1.default);
app.use('/api', transactionRoutes_1.default);
app.use('/api', categoryRoutes_1.default);
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'clientBuild', 'index.html'));
});
const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080);
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map