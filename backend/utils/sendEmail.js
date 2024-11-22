
import nodeMailer from "nodemailer";
export const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        server: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    })

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.mail,
        subject: options.subject,
        message: options.message
    };

    await transporter.sendMail(mailOptions);

}