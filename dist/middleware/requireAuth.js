"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAuth = (req, res, next) => {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.userId)
        next();
    else
        res.status(401).json({ authenticated: false });
};
exports.default = requireAuth;
//# sourceMappingURL=requireAuth.js.map