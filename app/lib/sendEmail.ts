import { createTransport } from "nodemailer";

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string; }) {
    return new Promise((resolve, reject) => {
        const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject: subject,
            html: html
        }

        transporter.sendMail(mailOptions).then(() => {
            resolve('Email has been sent')
        }).catch(reject)
    })
}

export {
    sendEmail
}