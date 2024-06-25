const { executeQuery, createPoolClients } = require('../database/pgDataBase.cjs');

class ConfirmCodeModel {
    save = async (phone, code) => {
        const poolClients = await createPoolClients();
        const query = 'INSERT INTO confirm (phone, confirmation_code, created_at) VALUES ($1, $2, NOW())';
        const values = [phone, code];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при сохранении кода подтверждения в PostgreSQL: ');
        return result ? result.rowCount === 1 : false;
    };

    get = async (phone) => {
        const poolClients = await createPoolClients();
        const query = 'SELECT confirmation_code FROM confirm WHERE phone = $1';
        const values = [phone];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при получении сохраненного кода подтверждения из PostgreSQL: ');
        return result && result.rows.length > 0 && result.rows[0].confirmation_code !== null
            ? result.rows[0].confirmation_code : null;
    };

    remove = async (phone) => {
        const currentTime = new Date();
        const minAge = new Date(currentTime.getTime() - 15 * 60 * 1000);
        const poolClients = await createPoolClients();
        const query = 'DELETE FROM confirm WHERE phone = $1 AND created_at <= $2';
        const values = [phone, minAge];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при удалении сохраненного кода подтверждения из PostgreSQL: ');
        return result ? result.rowCount === 1 : false;
    };

    removeOld = async () => {
        const currentTime = new Date();
        const minAge = new Date(currentTime.getTime() - 15 * 60 * 1000);
        const poolClients = await createPoolClients();
        const query = 'DELETE FROM confirm WHERE created_at <= $1';
        const values = [minAge];
        const result = await executeQuery(poolClients, query, values, 'Ошибка при удалении старых сохраненных кодов подтверждения из PostgreSQL: ');
        return result ? result.rowCount === 1 : false;
    };
}

module.exports = { ConfirmCodeModel };