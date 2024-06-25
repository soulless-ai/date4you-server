const { UserModel } = require('../models/User.cjs');

const { ConfirmCodeModel } = require('../models/ConfirmCode.cjs');

const { generateConfirmCode } = require('../utils/generator.cjs');
const { sendConfirmCode } = require('../utils/mailer.cjs');

class UserController {
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
        const response = {
            success: true,
            message: 'User data received successfully',
            data: {
                
            }
        };
        this.socket.send(JSON.stringify(response));
    }
    post = async (data) => {
        try {
            const phoneExists = await new UserModel().checkExists(this.message.data.phone);
            if (phoneExists) throw new Error('Данный phone уже зарегистрирован...');
            const confirmCode = await generateConfirmCode();
            if (!confirmCode) throw new Error('Проблемы при генерации кода подтверждения...');
            new ConfirmCodeModel().save(this.message.data.phone, confirmCode);
            await sendConfirmCode(this.message.data.phone, confirmCode);
            new UserModel().create(this.message.data);
            this.socket.send(JSON.stringify({ className: 'user', success: true, data: this.message.data }));
        } catch (error) {
            console.log(error);
            this.socket.send(JSON.stringify({ className: 'user', success: false, data: this.message.data }));
        }
    }
}

module.exports = { UserController };