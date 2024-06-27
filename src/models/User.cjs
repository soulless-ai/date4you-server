const { executeQuery, createPoolClients } = require('../database/pgDataBase.cjs');

class UserModel {
    login = async (data) => {
        const poolClients = await createPoolClients();
        const query = 'SELECT id FROM users WHERE phone = $1 AND nickname = $2;';
        const values = [data.phone, data.nickname];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при проверке пользователя для входа в PostgreSQL: ');
        return result && result.rows.length > 0 ? result.rows[0].id : null;
    }

    post = async (data) => {
        const poolClients = await createPoolClients();
        data.birthdate = `${data.birthdate}-01-01`;
        console.log(data);
        const query = `INSERT INTO users (name, lastname, phone, birthdate, gender, nickname, instagram, about, interests, zodiac, dating, created_at) 
                        VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9::jsonb, $10, $11, NOW()) RETURNING id`;
        const values = [data.name, data.lastname, data.phone, data.birthdate, data.gender, data.nickname, data.instagram, data.about, JSON.stringify(data.interests), data.zodiac, data.dating];
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