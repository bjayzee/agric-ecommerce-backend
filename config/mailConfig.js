const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SENDER_EMAIL, // generated ethereal user
        pass: process.env.SENDER_EMAIL_PWD, // generated ethereal password
    },
});
const base_url = process.env.Base_URL + process.env.PORT;


const sendEmail = async (to, subject, text) => {
    const msg = { from: process.env.SENDER_EMAIL, to, subject, text };
    await transport.sendMail(msg);
};


const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    
    const resetPasswordUrl = `${base_url}/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};


const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    
    const verificationEmailUrl = `${base_url}/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
};

module.exports = {
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
