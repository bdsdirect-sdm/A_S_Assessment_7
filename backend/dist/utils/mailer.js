"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: "anuragsharda131@gmail.com",
        pass: "ousbpkkzrkospnso"
    }
});
function sendOrder(email) {
    const mailOptions = {
        from: "anuragsharda131@gmail.com",
        to: email,
        subject: "Verify Account",
        html: `<html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 5px; text-align: center;">
                        <h2 style="color: #2c3e50;">Thank You for Your Order!</h2>
                        <p>We appreciate your business and are excited to serve you.</p>
                        <p style="margin: 20px 0; color: #555;">If you have any questions, feel free to contact us anytime.</p>
                        <p style="margin-top: 30px; font-size: 14px; color: #888;">Best Regards,<br>Your Company Team</p>
                    </div>
                </body>
            </html>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Error: ", error);
        }
        console.log('Email sent: ' + info.response);
        return info.response;
    });
}
exports.default = sendOrder;
