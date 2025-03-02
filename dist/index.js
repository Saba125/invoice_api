"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
const app = (0, express_1.default)();
dotenv_1.default.config();
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};
// Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60,
}));
// Db Connect
// Routes
app.use("/movie-images", express_1.default.static(path_1.default.join(__dirname, "../../public/movie-images")));
// app.use("/api/v1", router)
const PORT = process.env.PORT || 3000;
// Run app
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
