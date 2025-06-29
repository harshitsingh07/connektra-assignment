"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let cachedToken = null;
let tokenExpiry = null;
const getAccessToken = async () => {
    const now = Date.now();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }
    const res = await (0, node_fetch_1.default)(process.env.AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.APS_CLIENT_ID,
            client_secret: process.env.APS_CLIENT_SECRET,
            grant_type: "client_credentials",
            scope: "data:read data:write",
        }),
    });
    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiry = now + data.expires_in * 1000;
    return cachedToken;
};
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=auth.js.map