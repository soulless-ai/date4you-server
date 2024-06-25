const { executeQuery, createPoolClients } = require('../database/pgDataBase.cjs');

class UserModel {
    create = async (userData) => {
        const poolClients = await createPoolClients();
        const query = 'INSERT INTO users (name, lastname, phone, created_at) VALUES ($1, $2, $3, NOW()) RETURNING userID';
        const values = [userData.name, userData.lastname, userData.phone];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при добавлении данных пользователя в PostgreSQL: ');
        return result && result.rows.length > 0 ? parseInt(result.rows[0].id, 10) : null;
    }
    checkExists = async (phone) => {
        const poolClients = await createPoolClients();
        const query = 'SELECT EXISTS (SELECT 1 FROM users WHERE phone = $1);';
        const values = [phone];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при проверке существующего почтового адреса пользователя в PostgreSQL: ');
        return result && result.rows[0].exists;
    }
}

module.exports = { UserModel };