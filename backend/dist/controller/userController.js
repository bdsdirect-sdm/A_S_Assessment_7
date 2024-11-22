"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
const mailer_1 = __importDefault(require("../utils/mailer"));
const sendmail = (req, res) => {
    try {
        const { email } = req.body;
        (0, mailer_1.default)(email);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ "message": "something went wrong" });
    }
};
exports.sendmail = sendmail;
