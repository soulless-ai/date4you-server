const { UserModel } = require('../models/User.cjs');

class UserController {
    constructor(socket, message) {
        this.socket = socket;
        this.message = message;
    }
    WebSocketInput = () => {
        switch (this.message.type) {
            case 'login':
                this.login();
                break;
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
    login = async () => {
        try {
            const userID = await new UserModel().login(this.message.data);
            if (!userID) throw new Error('Неправильные данные...');
            this.socket.send(JSON.stringify({
                className: 'user',
                success: true,
                message: 'Login successful',
                data: { userID }
            }));
        } catch (error) {
            console.error('Error during login:', error);
            this.socket.send(JSON.stringify({
                className: 'user',
                success: false,
                message: 'Error during login',
                error: error.message
            }));
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
    post = async () => {
        try {
            new UserModel().post(this.message.data);
            this.socket.send(JSON.stringify({ className: 'user', success: true, data: this.message.data }));
        } catch (error) {
            console.log(error);
            this.socket.send(JSON.stringify({ className: 'user', success: false, data: this.message.data }));
        }
    }
}

module.exports = { UserController };