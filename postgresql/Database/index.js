module.exports = (() => {
    const config = require('./Config');
    const {
        Pool
    } = require('pg');


    const pool = new Pool(config.options);

    pool.on('connect', () => {
        //if (config.log) It suposed to long only when first connects but its loggin each query
    });

    const query = (query, params = []) => pool.query(query, params);


    const connect = async () => {
        let client = await pool
            .connect();
        client.query('SELECT 1');
    };
    return {
        connect: connect,
        query: query
    }
})();
