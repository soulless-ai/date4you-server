const nodemailer = require('nodemailer');
const config = require('../config.cjs');

const transporterMailRU = nodemailer.createTransport({
    host: config.transporterMailRU.host,
    port: config.transporterMailRU.port,
    secure: config.transporterMailRU.secure,
    auth: {
        user: config.transporterMailRU.auth.user,
        pass: config.transporterMailRU.auth.pass,
    },
});
// Отправка кода подтверждения на email
const sendConfirmCode = async (email, code) => {
    const mailOptions = {
        from: config.confirmationCodeSendOptions.from(config.transporterMailRU), // Адрес отправителя
        to: email, // Адрес получателя
        subject: config.confirmationCodeSendOptions.subject, // Тема письма
        text: config.confirmationCodeSendOptions.text + `${code}` // Текст письма
    };
    console.log(mailOptions);
    transporterMailRU.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Ошибка при отправке письма:', error);
        } else {
            console.log('Письмо успешно отправлено:', info.response);
        }
    });
}
module.exports = {
    transporterMailRU,
    sendConfirmCode,
};