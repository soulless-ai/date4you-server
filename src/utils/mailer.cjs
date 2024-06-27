const nodemailer = require('nodemailer');
const config = require('../config.cjs');

const transporterGMail = nodemailer.createTransport({
    host: config.transporterGMail.host,
    port: config.transporterGMail.port,
    secure: config.transporterGMail.secure,
    auth: {
        user: config.transporterGMail.auth.user,
        pass: config.transporterGMail.auth.pass,
    },
});
// Отправка кода подтверждения на email
const sendConfirmCode = async (email, code) => {
    const mailOptions = {
        from: config.confirmationCodeSendOptions.from(config.transporterGMail), // Адрес отправителя
        to: email, // Адрес получателя
        subject: config.confirmationCodeSendOptions.subject, // Тема письма
        text: config.confirmationCodeSendOptions.text + `${code}` // Текст письма
    };
    console.log(mailOptions);
    transporterGMail.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Ошибка при отправке письма:', error);
        } else {
            console.log('Письмо успешно отправлено:', info.response);
        }
    });
}
module.exports = {
    transporterGMail,
    sendConfirmCode,
};