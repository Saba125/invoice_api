"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const index_1 = __importDefault(require("../utils/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    var _a;
    const token = (_a = req.signedCookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return index_1.default.sendError(res, {
            status: "error",
            message: "Token is missing",
        }, 401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded !== null && "user" in decoded) {
            const _b = decoded, { user } = _b, rest = __rest(_b, ["user"]);
            req.user = Object.assign(Object.assign({}, user), rest);
        }
        else {
            req.user = decoded;
        }
        return next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        return index_1.default.sendError(res, {
            status: "error",
            message: "Invalid or expired token",
        }, 403);
    }
}
