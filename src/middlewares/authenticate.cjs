const jwt = require('jsonwebtoken');
const config = require('../config.cjs');

// Здесь можно использовать объект для хранения токенов в памяти
const tokenCache = new Map();

// Middleware для проверки аутентификации пользователя
module.exports = function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token is missing' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            console.log('Invalid token');
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
        } else {
            // Проверяем наличие токена в кэше
            if (!tokenCache.has(token)) {
                console.log('User is not authorized');
                return res.status(401).json({ error: 'Unauthorized', message: 'User is not authorized' });
            }
            
            console.log('User is authorized');
            req.userID = decoded; // Добавляем информацию о пользователе к объекту запроса
            next(); // Продолжаем выполнение следующего middleware или обработчика маршрута
        }
    });
};


// const token = jwt.sign({ userId: user.id }, config.jwtSecret);
// ws.send(JSON.stringify({ token }));
