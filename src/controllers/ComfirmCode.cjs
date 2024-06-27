const { UserModel } = require('../models/User.cjs');

const { ConfirmCodeModel } = require('../models/ConfirmCode.cjs');

const { generateConfirmCode } = require('../utils/generator.cjs');
const { sendConfirmCode } = require('../utils/mailer.cjs');

class ConfirmCodeController {
    constructor(socket, message) {
        this.socket = socket;
        this.message = message;
    }
    WebSocketInput = () => {
        switch (this.message.type) {
            case 'get':
                this.get();
                break;
            case 'post':
                this.post();
                break;
            default:
                break;
        }
    }
    get = async () => {
        try {
            const phoneExists = await new UserModel().checkExists(this.message.data.phone);
            if (phoneExists) throw new Error('Данный phone уже зарегистрирован...');
            const confirmCode = await generateConfirmCode();
            if (!confirmCode) throw new Error('Проблемы при генерации кода подтверждения...');
            await new ConfirmCodeModel().remove(this.message.data.phone);
            new ConfirmCodeModel().removeOld();
            new ConfirmCodeModel().save(this.message.data.phone, confirmCode);
            await sendConfirmCode(this.message.data.phone, confirmCode);
            this.socket.send(JSON.stringify({ className: 'confirm-code', success: true, data: this.message.data }));
        } catch (error) {
            console.log(error);
            this.socket.send(JSON.stringify({ className: 'confirm-code', success: false, data: this.message.data }));
        }
    }
    post = async () => {
        try {
            const savedCode = await new ConfirmCodeModel().get(this.message.data.phone);
            if (parseInt(this.message.data.code) !== parseInt(savedCode)) throw new Error('Неверный код подтверждения...');
            new ConfirmCodeModel().remove(this.message.data.phone);
            this.socket.send(JSON.stringify({ className: 'confirm-code', success: true }));
        } catch (error) {
            console.log(error);
            this.socket.send(JSON.stringify({ className: 'confirm-code', success: false }));
        }
    }
}

module.exports = { ConfirmCodeController };