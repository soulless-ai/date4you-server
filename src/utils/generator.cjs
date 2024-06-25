// Генерация случайного кода подтверждения
async function generateConfirmCode() {
    const length = 6; // Длина кода подтверждения
    const characters = '0123456789'; // Допустимые символы для кода подтверждения
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

module.exports = {
    generateConfirmCode
};