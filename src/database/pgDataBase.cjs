const pkg = require('pg');
const { Pool } = pkg;
const config = require('../config.cjs');

const createPool = (poolConfig) => new Pool(poolConfig);

const executeQuery = async (pool, query, values, errorMessage) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, values);
        return result;
    } catch (error) {
        console.error(`${errorMessage}: ${error}`);
        return null;
    } finally {
        if (client) {
            client.release();
        }
    }
};

const createPoolClients = async () => createPool({
    user: config.poolClients.user,
    host: config.poolClients.host,
    database: config.poolClients.database,
    password: config.poolClients.password,
    port: config.poolClients.port,
    ssl: {
        rejectUnauthorized: config.poolClients.ssl.rejectUnauthorized
    }
});

module.exports = {
    executeQuery,
    createPoolClients
};