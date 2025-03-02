"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../db/index"));
function getCryptoHash(data) {
    return crypto_1.default.createHash("sha256").update(data, "utf8").digest("hex");
}
function createToken(user) {
    return jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
}
function sendSuccess(res_1, data_1) {
    return __awaiter(this, arguments, void 0, function* (res, data, status = 200) {
        try {
            const resp = typeof data === "string" ? { message: data } : data;
            res.status(status).json(resp);
        }
        catch (error) {
            console.error("Error in sendSuccess:", error);
            res.status(500).json({ error: "Internal server error" });
        }
        finally {
            yield index_1.default.$disconnect();
        }
    });
}
function sendError(res_1, error_1) {
    return __awaiter(this, arguments, void 0, function* (res, error, status = 500) {
        try {
            const errorMessage = typeof error === "string" ? { error: error } : error;
            res.status(status).json(errorMessage);
        }
        catch (err) {
            console.error("Error in sendError:", err);
            res.status(500).json({ error: "Internal server error" });
        }
        finally {
            yield index_1.default.$disconnect();
        }
    });
}
const Utils = {
    getCryptoHash,
    createToken,
    sendSuccess,
    sendError,
};
exports.default = Utils;
